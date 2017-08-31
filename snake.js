class Snake{

    constructor(cell_width = 20, max = 25, color = '#fa0088'){
        this.max = max
        this.cell_width = cell_width
        this.length = 1
        this.positions = [{
            x: 13,
            y: 13,
            direction: ''
        }]
        this.color = color
        this.direction = 'up'
        this.over = false
        this.apple = {x: undefined, y: undefined}
    }

    appleRandom(){
        this.apple.x = Math.floor(Math.random() * this.max)
        this.apple.y = Math.floor(Math.random() * this.max)
        const x = this.apple.x * this.cell_width
        const y = this.apple.y * this.cell_width 
        console.log('Apple ' + this.apple.x + ' : ' + this.apple.y)
        $('#apple').remove()
        $('#gamescreen').append(`<div id="apple" style="background: #00ff00; top: ${y}px; left: ${x}px; width: ${this.cell_width}px; height: ${this.cell_width}px; border-radius: ${this.cell_width}px"></div>`)
    }

    go(direction = 'up'){
        const {x, y} = this.positions[0]
        $('#snake').remove()

        switch(direction){
            case 'down': this.render({x, y: y + 1, direction: 'down'}); break
            case 'left': this.render({x: x + 1, y, direction: 'right'}); break
            case 'up': this.render({x, y: y - 1, direction: 'up'}); break
            case 'right': this.render({x: x - 1, y, direction: 'left'}); break
        }
    }

    run(direction = 'up', speed = this.speed){
        this.speed = speed
        this.direction = direction

        const int = setInterval(() => {
            if(this.over === true){
                clearInterval(int)
            } else this.go(this.direction)
        }, 5000 / speed)


        $(document).keydown(e => {
            switch(e.which){
                case 65: this.direction = 'right'; break
                case 87: this.direction = 'up'; break
                case 68: this.direction = 'left'; break
                case 83: this.direction = 'down'; break
            }
        })
    }

    render(position){

        this.newOne = false

        this.positions.length === 1 ? this.positions = [position] : this.positions = [position, ...this.positions.slice(0, this.positions.length - 1)]
        
        const x = this.cell_width * this.positions[0].x - this.cell_width
        const y = this.cell_width * this.positions[0].y - this.cell_width

        $('.tail').remove()

        $('#gamescreen').append(`<div class = "tail" id="snake" style="top: ${y}px; left: ${x}px; width: ${this.cell_width}px; height: ${this.cell_width}px; background: ${this.color}"></div>`)
        
        this.positions.forEach((element, i) => {
            const tailX = this.cell_width * this.positions[i].x - this.cell_width
            const tailY = this.cell_width * this.positions[i].y - this.cell_width
            $('#gamescreen').append(`<div class="tail" style="top: ${tailY}px; left: ${tailX}px; width: ${this.cell_width}px; height: ${this.cell_width}px; background: ${this.color}"></div>`)
        })

        if(this.positions[0].x === this.apple.x + 1 && this.positions[0].y === this.apple.y + 1){
            
            console.log('Yammy')

            this.positions.push({
                x: this.positions[this.length - 1].x,
                y: this.positions[this.length - 1].y,
                direction: this.positions[this.length - 1].direction
            })

            this.length += 1

            this.newOne = true

            this.appleRandom()

        }

    }

    broke(){
        return new Promise((resolve, reject) => {
            const int = setInterval(() => {

                if(this.positions[0].x < 1 || this.positions[0].x > this.max || this.positions[0].y < 1 || this.positions[0].y > this.max){
                    this.over = true
                    clearInterval(int)
                    console.log('Stop')
                    resolve({broke: true})
                }

                this.positions.slice(1, this.length).forEach(el => { 
                    const now = this.positions[0]
                    if(this.newOne === false && el.x === now.x && el.y === now.y){
                        this.over = true
                        clearInterval(int)
                        console.log('Stop')
                        resolve({broke: true})
                    }
                })

            }, 5000 / this.speed)
        })
    }

    speed(val){
        this.speed = val
    }
}

$(document).ready(() => {
    console.log('Page was loaded')

    const field = {
        width: 25,
        height: 25,
        cell_width: Math.floor($('#gamescreen').height() / 25)
    }

    function startGame(){
        const snake = new Snake(field.cell_width, field.width)
        $('#gamestart').on('click', (e) => {
            
            $('.tail').remove()
            $('#gamestart').remove()

            snake.render({
                x: Math.round(field.width/2),
                y: Math.round(field.height/2),
                direction: 'down'
            })

            snake.run('down', 30)

            snake.broke().then(() => {
                $('#gamescreen').find('center').append('<div id="gamestart">You lose. Click here to retry</div>')
                startGame()
            })

            snake.appleRandom()

        })
    }
    startGame()

})
