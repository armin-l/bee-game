# Bee Game Logic Documentation

## Overview

The Bee Game is a simple yet engaging game where players interact with bees in a virtual environment. The game revolves around managing bees, their health, and their interactions with the player. The objective is to strategically "hit" bees to achieve specific goals while adhering to the game's rules.

---

## Core Mechanics

### 1. Bees

- **Types of Bees**:
  - **Queen Bee**: The most important bee. If its health reaches zero, the game ends.
  - **Worker Bees**: Supportive bees that can be hit without ending the game.
  - **Drone Bees**: Additional bees with unique properties (if applicable).
- **Health**: Each bee has a specific health value that decreases when hit.
- **Behavior**: Bees do not retaliate but are affected by player actions.

### 2. Player Actions

- **Hitting Bees**: The player can hit a bee, reducing its health by a predefined amount.
- **Random Targeting**: The bee to be hit is selected randomly from the available bees.

---

## Rules

1. The game starts with a predefined number of bees (e.g., 1 Queen, 5 Workers).
2. Each bee has an initial health value:
   - Queen Bee: 100 health points.
   - Worker Bees: 75 health points each.
3. When a bee is hit:
   - Its health decreases by a fixed amount (e.g., 10 points).
   - If the Queen Bee's health reaches zero, the game ends immediately.
4. The game continues until the Queen Bee's health is zero or all other bees are eliminated.

---

## Player Interactions

- **Random Bee Selection**: The player does not choose which bee to hit; the game randomly selects one.
- **Feedback**: After each hit, the game displays the affected bee and its remaining health.
- **Game Over**: The game notifies the player when the Queen Bee's health reaches zero.

---

## Progression Systems

- **Dynamic Difficulty**: As bees are eliminated, the pool of available targets decreases, increasing the likelihood of hitting the Queen Bee.
- **Score Tracking**: (Optional) Players can earn points for each hit, with bonuses for eliminating Worker Bees.

---

## Underlying Algorithms

### 1. Random Bee Selection

- **Algorithm**:
  1. Create a list of all bees currently in the game.
  2. Use a random number generator to select an index from the list.
  3. Return the bee at the selected index.

### 2. Health Reduction

- **Algorithm**:
  1. Subtract a fixed amount (e.g., 10 points) from the selected bee's health.
  2. Check if the bee's health is zero:
     - If the Queen Bee's health is zero, trigger the game-over sequence.
     - If a Worker Bee's health is zero, remove it from the game.

### 3. Game Over Check

- **Algorithm**:
  1. After each hit, check the Queen Bee's health.
  2. If the health is zero, display a "Game Over" message and end the game.

---

## Decision-Making Processes

- **Randomness**: The game relies on randomness to select bees, ensuring unpredictability.
- **Health Management**: Players must strategize their hits to avoid prematurely ending the game.

---

## Future Enhancements

- **Additional Bee Types**: Introduce new bees with unique behaviors or abilities.
- **Power-Ups**: Allow players to gain temporary advantages, such as double damage.
- **Multiplayer Mode**: Enable multiple players to interact with the game simultaneously.

---

This document provides a comprehensive overview of the Bee Game's logic, mechanics, and rules. It serves as a reference for developers and players to understand the game's inner workings.
