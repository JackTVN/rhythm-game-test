function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function IIDArrayValued(h, w, value) {
    let arr = Array(h);

    for (let i = 0; i < h; i++){
        arr[i] = Array(w);
        for (let j = 0; j < w; j++){
            arr[i][j] = value;
        }
    }

    return arr;
}

function CheckNeighborTiles(maze, p, h, w){
    let possibleTile = []

    let UpT    = {x: p.x, y: p.y - 1}
    let DownT  = {x: p.x, y: p.y + 1}
    let LeftT  = {x: p.x - 1, y: p.y}
    let RightT = {x: p.x + 1, y: p.y}

    if ( UpT.y >= 0 && maze[UpT.y * 2][ UpT.x * 2] === "#")
        possibleTile.push(UpT)
    if ( DownT.y <= h && maze[DownT.y * 2][ DownT.x * 2] === "#")
        possibleTile.push(DownT)
    if ( LeftT.x >= 0 && maze[LeftT.y * 2][ LeftT.x * 2] === "#")
        possibleTile.push(LeftT)
    if ( RightT.x <= w && maze[RightT.y * 2][ RightT.x * 2] === "#")
        possibleTile.push(RightT)

    if (possibleTile.length === 0)
        return p
    else
        return possibleTile[Math.floor(Math.random()*possibleTile.length)]

}

export function asciiMaze(h, w) {
    let maze = IIDArrayValued(h, w, "#")

    let path = []
    let visited = 1

    let tileH = Math.floor((h - 1) / 2)
    let tileW = Math.floor((w - 1) / 2)

    let pos = {x: randomNumber(0, tileW), y: randomNumber(0, tileH)}

    maze[pos.y * 2][pos.x * 2] = '.'

    path.push(pos)

    while (visited < (tileH + 1) * (tileW + 1)) {
        let next = CheckNeighborTiles(maze, pos, tileH, tileW)

        if (next === pos) pos = path.pop()
        else {
            maze[next.y * 2][next.x * 2] = '.'
            maze[next.y + pos.y][next.x + pos.x] = '.'
            path.push(next)
            pos = next
            visited++
        }
    }

    return maze;
}