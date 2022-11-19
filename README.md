# Tetris AI for LED matrixes (like WLED)
This work is based on the work of https://github.com/LeeYiyuan/tetrisai. Thank you.

The main idea is to use this code to generate [TPM2.net](https://gist.github.com/jblang/89e24e2655be6c463c56) packages (special UDP packages) and send them to a LED matrix. The easies setup might be to use some matrix (eg. WS2812) with the [WLED](https://kno.wled.ge/) firmware and setup a [tpm2.net](https://kno.wled.ge/interfaces/udp-realtime/) receiver.

To run the code go to the 'js' folder and start:
```
nodejs index.js
```

ATTENTION:
Most parameters are still hard coded to my setup of 20x15 pixels. If I find some time I might change that to a more flexible approach. Suggestions with pull request are welcome.

## License
Copyright (C) 2017 muebau
[MIT License](https://github.com/LeeYiyuan/tetrisai/blob/gh-pages/License.md)
