# Decentralized Voting System
source: projects/voting-system.md
category: project
last_updated: 2026-06-16

## Summary
The Decentralized Voting System is a blockchain-based voting platform built on Ethereum using Solidity smart contracts.

It eliminates centralized trust requirements by storing critical vote actions on-chain, making vote records immutable and publicly verifiable.

## Verified Stack
The project uses React, Solidity, Ethereum, Web3.js, Node.js, MongoDB, and MetaMask.

The product spec mentions Hardhat/Truffle, but the exact framework should be verified.

## Architecture
Voter Browser with MetaMask -> React Frontend -> Ethereum Network -> Solidity Smart Contract -> MongoDB Backend.

The smart contract handles critical operations such as castVote(), getResults(), and verifyVoter().

MongoDB stores off-chain metadata such as candidate profiles, election configuration, and admin data.

## Authentication Flow
Authentication is wallet-based. A voter connects MetaMask and signs blockchain transactions. The vote is submitted as an Ethereum transaction rather than a traditional session-backed form submission.

## Blockchain Rationale
Blockchain is useful here because votes benefit from immutability and public verification.

Not every piece of data belongs on-chain. Candidate profiles and election configuration can remain off-chain to reduce cost and complexity.

## Lessons
The project demonstrates smart contract boundaries, wallet authentication UX, and the tradeoff between on-chain trust and off-chain practicality.

TODO_VERIFY:
Confirm whether Hardhat, Truffle, or both were used.
Confirm GitHub repository URL.
Confirm live demo URL.

