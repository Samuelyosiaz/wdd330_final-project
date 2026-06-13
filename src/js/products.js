import { loadHeaderFooter, toggleMenu } from "./utils.mjs";

async function init() {
    await loadHeaderFooter();
    toggleMenu();
}

init();