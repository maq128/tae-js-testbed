"C:\Program Files\Google\Chrome\Application\chrome.exe" --pack-extension="%CD%\src" --pack-extension-key="%CD%\tae-js-testbed.pem" --no-message-box
del tae-js-testbed.crx
rename src.crx tae-js-testbed.crx
