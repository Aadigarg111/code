// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CodingChallenge
 * @dev Contract for managing coding challenges with staking and rewards
 */
contract CodingChallenge is ReentrancyGuard, Ownable {
    struct Challenge {
        uint256 id;
        address creator;
        uint256 stakingAmount;
        uint256 duration;
        uint256 startTime;
        bool isActive;
        uint256 participantCount;
        uint256 rewardPool;
    }

    struct Participant {
        address wallet;
        uint256 stakedAmount;
        uint256 lastProgressUpdate;
        bool hasCompleted;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => mapping(address => Participant)) public participants;
    
    uint256 public nextChallengeId;
    uint256 public platformFee = 5; // 5% platform fee

    event ChallengeCreated(
        uint256 indexed challengeId,
        address indexed creator,
        uint256 stakingAmount,
        uint256 duration
    );
    
    event ParticipantJoined(
        uint256 indexed challengeId,
        address indexed participant,
        uint256 stakedAmount
    );
    
    event ProgressUpdated(
        uint256 indexed challengeId,
        address indexed participant,
        uint256 timestamp
    );
    
    event RewardClaimed(
        uint256 indexed challengeId,
        address indexed participant,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new coding challenge
     * @param _stakingAmount Amount to stake in ETH
     * @param _duration Duration in days
     */
    function createChallenge(uint256 _stakingAmount, uint256 _duration) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value == _stakingAmount, "Must stake exact amount");
        require(_duration > 0, "Duration must be greater than 0");
        
        uint256 challengeId = nextChallengeId++;
        
        challenges[challengeId] = Challenge({
            id: challengeId,
            creator: msg.sender,
            stakingAmount: _stakingAmount,
            duration: _duration * 1 days,
            startTime: block.timestamp,
            isActive: true,
            participantCount: 1,
            rewardPool: _stakingAmount
        });
        
        participants[challengeId][msg.sender] = Participant({
            wallet: msg.sender,
            stakedAmount: _stakingAmount,
            lastProgressUpdate: block.timestamp,
            hasCompleted: false
        });
        
        emit ChallengeCreated(challengeId, msg.sender, _stakingAmount, _duration);
        emit ParticipantJoined(challengeId, msg.sender, _stakingAmount);
    }

    /**
     * @dev Join an existing challenge
     * @param _challengeId ID of the challenge to join
     */
    function joinChallenge(uint256 _challengeId) 
        external 
        payable 
        nonReentrant 
    {
        Challenge storage challenge = challenges[_challengeId];
        require(challenge.isActive, "Challenge is not active");
        require(
            block.timestamp < challenge.startTime + challenge.duration,
            "Challenge has ended"
        );
        require(
            msg.value == challenge.stakingAmount,
            "Must stake exact amount"
        );
        require(
            participants[_challengeId][msg.sender].wallet == address(0),
            "Already participating"
        );
        
        participants[_challengeId][msg.sender] = Participant({
            wallet: msg.sender,
            stakedAmount: msg.value,
            lastProgressUpdate: block.timestamp,
            hasCompleted: false
        });
        
        challenge.participantCount++;
        challenge.rewardPool += msg.value;
        
        emit ParticipantJoined(_challengeId, msg.sender, msg.value);
    }

    /**
     * @dev Update progress for a challenge
     * @param _challengeId ID of the challenge
     */
    function updateProgress(uint256 _challengeId) 
        external 
        nonReentrant 
    {
        Challenge storage challenge = challenges[_challengeId];
        Participant storage participant = participants[_challengeId][msg.sender];
        
        require(challenge.isActive, "Challenge is not active");
        require(participant.wallet != address(0), "Not participating");
        require(!participant.hasCompleted, "Already completed");
        require(
            block.timestamp <= challenge.startTime + challenge.duration,
            "Challenge has ended"
        );
        
        participant.lastProgressUpdate = block.timestamp;
        emit ProgressUpdated(_challengeId, msg.sender, block.timestamp);
    }

    /**
     * @dev Claim rewards for completing a challenge
     * @param _challengeId ID of the challenge
     */
    function claimReward(uint256 _challengeId) 
        external 
        nonReentrant 
    {
        Challenge storage challenge = challenges[_challengeId];
        Participant storage participant = participants[_challengeId][msg.sender];
        
        require(
            block.timestamp > challenge.startTime + challenge.duration,
            "Challenge not ended"
        );
        require(participant.wallet != address(0), "Not participating");
        require(!participant.hasCompleted, "Already claimed");
        
        bool isSuccessful = _validateCompletion(_challengeId, msg.sender);
        require(isSuccessful, "Challenge requirements not met");
        
        participant.hasCompleted = true;
        uint256 reward = _calculateReward(_challengeId, msg.sender);
        
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(_challengeId, msg.sender, reward);
    }

    /**
     * @dev Internal function to validate if a participant completed the challenge
     */
    function _validateCompletion(uint256 _challengeId, address _participant) 
        internal 
        view 
        returns (bool) 
    {
        Challenge storage challenge = challenges[_challengeId];
        Participant storage participant = participants[_challengeId][_participant];
        
        // Basic validation: Check if participant has been updating progress regularly
        uint256 daysSinceLastUpdate = (block.timestamp - participant.lastProgressUpdate) / 1 days;
        return daysSinceLastUpdate <= 1;
    }

    /**
     * @dev Internal function to calculate reward amount
     */
    function _calculateReward(uint256 _challengeId, address _participant) 
        internal 
        view 
        returns (uint256) 
    {
        Challenge storage challenge = challenges[_challengeId];
        uint256 platformFeeAmount = (challenge.rewardPool * platformFee) / 100;
        uint256 distributedAmount = challenge.rewardPool - platformFeeAmount;
        
        return distributedAmount / challenge.participantCount;
    }

    /**
     * @dev Update platform fee percentage
     * @param _newFee New fee percentage (1-20)
     */
    function updatePlatformFee(uint256 _newFee) 
        external 
        onlyOwner 
    {
        require(_newFee <= 20, "Fee too high");
        platformFee = _newFee;
    }

    /**
     * @dev Withdraw platform fees
     */
    function withdrawPlatformFees() 
        external 
        onlyOwner 
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
    }
}
