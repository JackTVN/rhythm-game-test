import { Chart } from "../chart/test.js"

var PHASE_IN_TIME = 3.00
var NOTE_SPEED = 6 //idk

export class Game {
    constructor(chartFile, setting, dimension) {
        this.chart = Chart[chartFile]
        this.setting = setting

        this.stage = new PIXI.Container()
        this.draw = new PIXI.Graphics()

        this.dimension = dimension

        this.time = 0

        this.core = { x: this.dimension.x / 2, y: this.dimension.y / 1.2 }
        this.line = [
            //{ id: 1, x: this.dimension.x / 5, y: 0 },
            //{ id: 2, x: this.dimension.x / 5 * 4, y: 0 },
        ]

        this.stage.addChild(this.draw)
    }

    showInfo() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 10,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#ffffff'
        })

        let artistText = new PIXI.Text(this.chart.artist, style)
        let songText = new PIXI.Text(this.chart.sound_name, style)
        let diffText = new PIXI.Text(this.chart.difficulty, style)

        artistText.x = 2; artistText.y = 2
        songText.x = 2; songText.y = 12
        diffText.x = 2; diffText.y = 22

        this.stage.addChild(artistText, songText, diffText)
    }

    update(delta) {
        this.time += delta * 16.66 / 1000

        let cX = this.core.x
        let cY = this.core.y

        this.draw.lineStyle(2, 0xFFFFFF)

        // Draw all line connect to the player
        for (let i = 0; i < this.line.length; i++) {
            this.draw
                .moveTo(cX, cY)
                .lineTo(this.line[i].x, this.line[i].y)
        }

        this.draw.lineStyle(4, 0xFFFFFF)
        // Draw the anchor line
            this.draw
            .moveTo(this.dimension.x / 2, 0)
            .lineTo(this.dimension.x / 2, this.dimension.y)

        // Draw the player/core
        this.draw
            .beginFill(0xFFFFFF)
            .drawCircle(cX, cY, 16)
            .beginFill(0x000000)
            .drawCircle(cX, cY, 14)


        // Draw all the visible note (Weird order for aesthetic reason)
        for (let i = 0; i < this.line.length; i++) {

            // Get the rotation(in radian) of rotation the line
            let rotation = Math.atan2(this.line[i].y - cY, this.line[i].x - cX)

            // Finalize the position of the note using the rotation
            let distance = NOTE_SPEED * 50
            let singularX = distance * Math.cos(rotation)
            let singularY = distance * Math.sin(rotation)

            // Go through all the note time
            for (let j = 0; j < this.chart.note["id" + this.line[i].id].length; j++) {

                // Check if note have not passed
                if (this.chart.note["id" + this.line[i].id][j] >= this.time - PHASE_IN_TIME) {

                    let nX = cX + (this.chart.note["id" + this.line[i].id][j] - this.time + PHASE_IN_TIME) * singularX
                    let nY = cY + (this.chart.note["id" + this.line[i].id][j] - this.time + PHASE_IN_TIME) * singularY

                    if (nX > (0 - this.dimension.x * 0.1) && nX < this.dimension.x * 1.1 && nY > (0 - this.dimension.x * 0.1) && nY < this.dimension.y * 1.1) {

                        // Draw all note that should be visible on the line
                        this.draw
                            .beginFill(0xFFFFFF)
                            .drawCircle(nX, nY, 7)
                    }
                }
            }
        }
    }
}