const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CodingChallenge", function () {
  let codingChallenge;
  let owner;
  let participant1;
  let participant2;

  beforeEach(async function () {
    [owner, participant1, participant2] = await ethers.getSigners();

    const CodingChallenge = await ethers.getContractFactory("CodingChallenge");
    codingChallenge = await CodingChallenge.deploy();
  });

  describe("Challenge Creation", function () {
    it("Should create a new challenge", async function () {
      const stakingAmount = ethers.parseEther("0.1");
      const duration = 30; // 30 days

      await expect(codingChallenge.createChallenge(stakingAmount, duration, {
        value: stakingAmount
      }))
        .to.emit(codingChallenge, "ChallengeCreated")
        .to.emit(codingChallenge, "ParticipantJoined");

      const challenge = await codingChallenge.challenges(0);
      expect(challenge.stakingAmount).to.equal(stakingAmount);
      expect(challenge.duration).to.equal(duration * 24 * 60 * 60); // days to seconds
      expect(challenge.isActive).to.be.true;
    });
  });

  describe("Challenge Participation", function () {
    beforeEach(async function () {
      const stakingAmount = ethers.parseEther("0.1");
      await codingChallenge.createChallenge(stakingAmount, 30, {
        value: stakingAmount
      });
    });

    it("Should allow participants to join", async function () {
      const stakingAmount = ethers.parseEther("0.1");

      await expect(codingChallenge.joinChallenge(0, {
        value: stakingAmount
      }))
        .to.emit(codingChallenge, "ParticipantJoined")
        .withArgs(0, participant1.address, stakingAmount);

      const participant = await codingChallenge.participants(0, participant1.address);
      expect(participant.wallet).to.equal(participant1.address);
      expect(participant.stakedAmount).to.equal(stakingAmount);
    });
  });

  describe("Progress Updates", function () {
    beforeEach(async function () {
      const stakingAmount = ethers.parseEther("0.1");
      await codingChallenge.createChallenge(stakingAmount, 30, {
        value: stakingAmount
      });
      await codingChallenge.connect(participant1).joinChallenge(0, {
        value: stakingAmount
      });
    });

    it("Should allow progress updates", async function () {
      await expect(codingChallenge.connect(participant1).updateProgress(0))
        .to.emit(codingChallenge, "ProgressUpdated")
        .withArgs(0, participant1.address, await ethers.provider.getBlock("latest").then(b => b.timestamp));
    });
  });
});