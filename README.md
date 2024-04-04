Private Attribution Web Extension
================================

Usage
-----

1. In Firefox, browse to about:debugging and click "This Firefox".
2. Click "Load Temporary Add-on..." and select a file in this directory to load the add on.
3. In Firefox, browse to about:addons, click this add on, click Permissions, and enable "Access your data for all websites".
4. In a new tab, open ./websites/source.html
5. Press F12 to open dev tools for source.html to view console logs.
6. Open the Browser Toolbox in order to view console logs from the background process that "sends" the reports.

Use Cases
---------
1. Each time source.html loads, an impression will be registered.
2. Clicking the Ad Button on source.html will register a click event and redirect to target.html for the ad.
3. Clicking the Purchase Button on target.html will register a conversion.
4. Periodically, background.js will run to send accumulated data to DAP.

You can debug by viewing console logs in the Browser Toolbox or Dev Tools.
