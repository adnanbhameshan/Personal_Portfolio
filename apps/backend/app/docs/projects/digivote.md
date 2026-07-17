# DigiVote
source: projects/digivote.md
category: project
last_updated: 2026-06-21

## Summary
DigiVote is a blockchain-based decentralized voting system built on Ethereum using Solidity smart contracts.

It eliminates centralized trust requirements by storing critical vote actions on-chain, making vote records immutable and publicly verifiable.

## Verified Stack
The project uses React, Solidity, Ethereum, Truffle, Web3.js, Node.js, MongoDB, and MetaMask.

GitHub repository: https://github.com/adnanbhameshan/DigiVote-a-voting-platform

DigiVote was not deployed as a public live demo. It was tested in a controlled college environment using a local Ethereum network.

## Architecture
Voter Browser with MetaMask -> React Frontend -> Ethereum Network -> Solidity Smart Contract developed and tested with Truffle -> MongoDB Backend.

The smart contract handles critical operations such as castVote(), getResults(), and verifyVoter().

MongoDB stores off-chain metadata such as candidate profiles, election configuration, and admin data.

## Authentication Flow
Authentication is wallet-based. A voter connects MetaMask and signs blockchain transactions. The vote is submitted as an Ethereum transaction rather than a traditional session-backed form submission.

## Blockchain Rationale
Blockchain is useful here because votes benefit from immutability and public verification.

Not every piece of data belongs on-chain. Candidate profiles and election configuration can remain off-chain to reduce cost and complexity.

## Lessons
The project demonstrates smart contract boundaries, wallet authentication UX, and the tradeoff between on-chain trust and off-chain practicality.

## Screenshots
The available screenshots show the voter dashboard, vote submission screen, MetaMask transaction confirmation, successful vote notification, voter registration and login flows, admin login, admin home, and admin election management screens for create, update, and delete operations.
