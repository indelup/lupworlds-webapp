# LupWorlds Project Web App

LupWorlds is a personal project that consist on providing a GACHA system for streamers on Twitch.
The main idea is to provide streamers with tools to create items that can be obtained via pulling from a gacha using chat commands on their streams. These items can be:

- Characters - What the name implies, a character.
- Materials - Stuff that can be used to craft items or level up characters.
- Items - Stuff that can be used to decorate the space

Aside from being able to get items, the idea is to provide a web based game where users can decorate a space and interact with their characters.

---

This repository corresponds to the public access page of the project.

Here **Streamers** will be able to:

- Create Characters
- Create Items
- Create Materials
- Set up Banners
- Set up Shops
- Specify chat Commands for pulling
- Start/Stop the twitch chat Bot

And **Viewers** will be able to:

- See their Characters, Items and Materials
- Craft Items / Level up Characters
- Play the embedded game

---

This repository was started using the Phaser 3 project template **([Link here](https://github.com/phaserjs/template-react-ts))**. As the intention is to eventually provide a playable game where users can make use of their obtained characters. This said, the initial development focus will be on the gacha system itself and the actual game development will only start when that is done.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command               | Description                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm install`         | Install project dependencies                                                                             |
| `npm run dev`         | Launch a development web server                                                                          |
| `npm run build`       | Create a production build in the `dist` folder                                                           |
| `npm run dev-nolog`   | Launch a development web server without sending anonymous data (see "About log.js" below)                |
| `npm run build-nolog` | Create a production build in the `dist` folder without sending anonymous data (see "About log.js" below) |

## Stack

- `zustand` for state management
- `antd` for components and design
- `phaser` for game development
