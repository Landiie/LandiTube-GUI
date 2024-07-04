# LandiTube-GUI
GUI for LandiTube written in good ol' HTML, CSS, and JS, with Vite as my tool of choice and a plugin to allow a single file output on build.

# Download
You shouldn't need to get the manual download of the GUI, but if you need it, check the releases tab on the right! the GUI comes bundled with every release of LandiTube 0.30.0^.

# Installation
Place the `index.html` file from releases into `(SAMMI Directory)\Landies_Extensions\LandiTube\GUI\index.html`.

# Setting up the environment

If you are a developer wanting to peer into the GUI and see how it's built or submit a pull request for some changes/feature additions, here is how to set up your environment!

1. Fork and Clone this repository however you choose. I recommend Github Desktop if you are new to Git!
2. Open the terminal in the directory, and run `npm install`. This will install all of the dependancies as well as Vite itself.
3. run `npm run dev` to start the Vite server. The terminal should give you a link to open the page.
4. There you go! To build it into a single file, close the Vite server with CTRL + C, then run `npm build`, which will output a single `index.html` file inside a dist folder. You can take this and replace it in `(SAMMI Directory)\Landies_Extensions\LandiTube\GUI\index.html`.