import { ScillaContract, initZilliqa, setAccount } from "hardhat-scilla-plugin";
import { Value } from "@zilliqa-js/contract";
import { assert, expect } from "chai";
import hre from "hardhat";
import { loadZilliqaHardhatObject } from "hardhat-scilla-plugin/dist/src/ZilliqaHardhatObject";
import * as zcrypto from "@zilliqa-js/crypto";

const newpk = zcrypto.schnorr.generatePrivateKey();

// these are all isolated server genesis accounts; if you're using devnet,
// you'll need to find three accounts and put their private keys here.
const adminpk =
  "db11cfa086b92497c8ed5a4cc6edb3a5bfe3a640c43ffb9fc6aa0873c56f2ee3";
const userpk =
  "e53d1c3edaffc7a7bab5418eb836cf75819a82872b4a1a0f1c7fcf5c3e020b89";

const privateKeys = [adminpk, userpk];
const network_url = "http://localhost:5555";
const chain_id = 1; // 222;
const setup = initZilliqa(network_url, chain_id, privateKeys);

const adminaddress = zcrypto.getAddressFromPrivateKey(adminpk).toLowerCase();
const useraddress = zcrypto.getAddressFromPrivateKey(userpk).toLowerCase();

const adminpubkey = zcrypto.getPubKeyFromPrivateKey(adminpk);
const userpubkey = zcrypto.getPubKeyFromPrivateKey(userpk);

describe("BurnAnyTokenZRC2Test", () => {
  var burncontract: ScillaContract;
  var zrc2contract: ScillaContract;

  beforeEach(async () => {
    setAccount(0);
    burncontract = await hre.deployScilla("BurnTokensAnyZRC2", adminaddress);
    zrc2contract = await hre.deployScilla(
      "FungibleToken",
      adminaddress,
      "TestToken",
      "TT",
      "0",
      "100000"
    );
  });

  it("Should deploy correctly", async () => {
    expect(burncontract.address).to.be.properAddress;
    expect(zrc2contract.address).to.be.properAddress;
  });

  it("Should be possible to set a burn allowance", async () => {
    setAccount(1);
    // This asks us to set up a burn allowance for account 1 from zrc2contract.address for 100 tokens
    {
      await burncontract.UpdateBurnAllowance(zrc2contract.address, 100);
      const allowed_burn = (await burncontract.allow_burn_tokens())[
        zrc2contract.address!.toLowerCase()
      ][useraddress];
      assert(allowed_burn == 100);
    }

    // Now set it back to 0.
    {
      await burncontract.UpdateBurnAllowance(zrc2contract.address, 0);
      const allowed_burn = (await burncontract.allow_burn_tokens())[
        zrc2contract.address!.toLowerCase()
      ][useraddress];
      assert(allowed_burn == 0);
    }
  });

  it("Should be possible to burn tokens", async () => {
    setAccount(0);
    await zrc2contract.Transfer(useraddress, 100);
    await burncontract.ChangeBurnCancelBlocks(0);

    setAccount(1);
    // We'll check that the events fire properly here so as not to have another test
    // case (and thus speed up tests)
    {
      let tx = await burncontract.UpdateBurnAllowance(
        zrc2contract.address,
        100
      );
      expect(tx).to.eventLogWithParams(
        "UpdateBurnAllowanceSuccess",
        { value: zrc2contract.address.toLowerCase(), vname: "token_address" },
        { value: "100", vname: "token_amount" },
        { value: useraddress, vname: "updated_by" }
      );
    }
    await zrc2contract.Transfer(burncontract.address!, 100);

    // Burns can be finalised by anyone
    // @todo when we have ZIL transfers, make this a separate account - can't at the
    // moment 'cos it won't have enough gas.
    setAccount(0);
    {
      let tx = await burncontract.FinaliseBurn(
        zrc2contract.address,
        useraddress
      );
      expect(tx).to.eventLogWithParams(
        "TokenBurnConfirmation",
        { value: zrc2contract.address.toLowerCase(), vname: "token_address" },
        { value: "100", vname: "token_amount" },
        { value: useraddress, vname: "burnt_by" }
      );
    }

    const pending_burn = await burncontract.pending_burn();
    const balances = await zrc2contract.balances();

    assert(
      pending_burn[useraddress] == null,
      "The user should have no pending burns"
    );
    assert(balances[useraddress] == 0, "The user should have no tokens");
    assert(
      balances[burncontract.address!.toLowerCase()] == 100,
      "The contract should have 100 tokens"
    );
    assert(
      balances[adminaddress] == 99900,
      "The admin must have all unburned tokens"
    );
  });

  it("Should be possible to undo your burn before the timeout expires", async () => {
    setAccount(0);
    await zrc2contract.Transfer(useraddress, 100);
    await burncontract.ChangeBurnCancelBlocks(20);

    setAccount(1);
    await burncontract.UpdateBurnAllowance(zrc2contract.address, 100);
    await zrc2contract.Transfer(burncontract.address!, 100);
    await burncontract.CancelBurn(zrc2contract.address);

    const pending_burn = await burncontract.pending_burn();
    const balances = await zrc2contract.balances();

    assert(
      pending_burn[useraddress] == null,
      "The user should have no pending burns"
    );
    assert(balances[useraddress] == 100, "The user should have 100 tokens");
    assert(
      balances[burncontract.address!.toLowerCase()] == 0,
      "The contract should have 100 tokens"
    );
    assert(
      balances[adminaddress] == 99900,
      "The admin must have all unburned tokens"
    );

    // Try to finalise the burn...
    // Burns can be actioned by anyone
    setAccount(0);
    await burncontract.FinaliseBurn(zrc2contract.address, useraddress);
    assert(
      pending_burn[useraddress] == null,
      "The user should have no pending burns"
    );
    assert(balances[useraddress] == 100, "The user should have 100 tokens");
    assert(
      balances[burncontract.address!.toLowerCase()] == 0,
      "The contract should have 100 tokens"
    );
    assert(
      balances[adminaddress] == 99900,
      "The admin must have all unburned tokens"
    );
  });

  it("Should not be possible to undo a burn after the timeout expires", async () => {
    setAccount(0);
    await zrc2contract.Transfer(useraddress, 100);
    // This is a hack because it is hard (and takes a long time) to allow blocks to pass.
    await burncontract.ChangeBurnCancelBlocks(0);

    setAccount(1);
    await burncontract.UpdateBurnAllowance(zrc2contract.address, 100);

    await zrc2contract.Transfer(burncontract.address!, 100);
    await burncontract.CancelBurn(zrc2contract.address);

    const pending_burn = await burncontract.pending_burn();
    const balances = await zrc2contract.balances();

    assert(
      pending_burn[useraddress] == null,
      "The user should have no pending burns"
    );
    assert(balances[useraddress] == 0, "The user should have no tokens");
    assert(
      balances[burncontract.address!.toLowerCase()] == 100,
      "The contract should have 200 tokens"
    );
    assert(
      balances[adminaddress] == 99900,
      "The admin must have all unburned tokens"
    );
  });
});
