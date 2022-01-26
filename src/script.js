import {Game} from './play_session/start_play.js'

// The application will create a renderer using WebGL, if possible,
const mainRenderer = new PIXI.Renderer({
    width: 800,
    height: 600,
    resolution: 2,
    autoDensity: true,
    antiAlias: true,
})

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(mainRenderer.view);

const playBtn = new PIXI.Sprite.from('./src/resources/play_button.png');

console.log(document.URL);

const mainMenu = new PIXI.Container()

mainMenu.addChild(playBtn)

playBtn.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR
playBtn.scale.set(0.1)
playBtn.anchor.set(0.5, 0.5)
playBtn.roundPixels = true

playBtn.x = mainRenderer.width / mainRenderer.resolution / 2
playBtn.y = mainRenderer.height / mainRenderer.resolution / 2

playBtn.interactive = true
playBtn.buttonMode = true

playBtn
    .on('mouseover', () => {
        playBtn.tint = 1.1 * 0xFFFFFF
    })
    .on('mouseout', () => {
        playBtn.tint = 0xFFFFFF
    })
    .on('mousedown', () => {
        startGame()
        playBtn.tint = 0xFFFFFF
        playBtn.interactive = false
    })

let menuTicker = PIXI.Ticker.shared

menuTicker.add((delta) => {
    mainRenderer.render(mainMenu)
})

function startGame() {
    menuTicker.stop();

    let currentGame = new Game(
        "press_start", 
        "setting_moment", 
        {
            x: mainRenderer.width / mainRenderer.resolution, 
            y: mainRenderer.height / mainRenderer.resolution
        }
    )

    currentGame.showInfo()

    let FPS = new PIXI.Text("", {
        fontFamily: 'Arial',
        fontSize: 10,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: '#ffffff'
    })

    FPS.x = 2; FPS.y = 32

    currentGame.stage.addChild(FPS)

    let gameTicker = PIXI.Ticker.shared
    let isPlaying = true

    var music = new Audio('./src/music/press_start.mp3')
    let musicPlaying = false

    // Main Loop
    gameTicker.add((delta) => {
        if (!musicPlaying && currentGame.time - 3000 >= 0){
            music.play()
            console.log("pog");
            musicPlaying = true
        }

        currentGame.draw.clear()
        currentGame.update(delta)
        mainRenderer.render(currentGame.stage)
        FPS.text = "FPS: "+ Math.round(gameTicker.FPS)
    })
}