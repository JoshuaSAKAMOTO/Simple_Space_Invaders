const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class SpaceInvader {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.dead = false;
    }

    draw() {
        if (!this.dead) {
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.size = 20;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    move(direction) {
        this.x += direction * this.speed;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
        }
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 4;
        this.speed = 8;
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.y -= this.speed;
    }

    isOutOfBounds() {
        return this.y < 0;
    }

    hasCollidedWithInvader(invader) {
        if (invader.dead) {
            return false;
        }

        return (
            this.x < invader.x + invader.size &&
            this.x + this.size > invader.x &&
            this.y < invader.y + invader.size &&
            this.y + this.size > invader.y
        );
    }
}

const player = new Player();
const invaders = [];
const bullets = [];

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
        invaders.push(new SpaceInvader(40 + i * 80, 30 + j * 60));
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();
    invaders.forEach(invader => invader.draw());
}
// 既存のキーボード操作関連のコードを以下に置き換えます。

// キーボード操作の状態を保存するオブジェクト
const keys = {
    a: false,
    d: false,
    w: false
};

// キーボードイベントリスナー
document.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
        keys.a = true;
    } else if (e.key === 'd' || e.key === 'D') {
        keys.d = true;
    } else if (e.key === 'w' || e.key === 'W') {
        keys.w = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'A') {
        keys.a = false;
    } else if (e.key === 'd' || e.key === 'D') {
        keys.d = false;
    } else if (e.key === 'w' || e.key === 'W') {
        keys.w = false;
    }
});

function update() {
    // プレイヤーの移動
    if (keys.a) {
        player.move(-1);
    }
    if (keys.d) {
        player.move(1);
    }

    // 弾の発射
    if (keys.w) {
        bullets.push(new Bullet(player.x + player.size / 2 - 2, player.y));
        keys.w = false; // 連続発射を防ぐ
    }

    // 弾の更新
    bullets.forEach((bullet, index) => {
        bullet.update();

        if (bullet.isOutOfBounds()) {
            bullets.splice(index, 1);
        } else {
            for (let i = invaders.length - 1; i >= 0; i--) {
                if (bullet.hasCollidedWithInvader(invaders[i])) {
                    bullets.splice(index, 1);
                    invaders[i].dead = true;
                    break;
                }
            }
        }
    });
}

// gameLoop 関数内に update() 関数を追加
function gameLoop() {
    update();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    invaders.forEach(invader => invader.draw());
    bullets.forEach(bullet => bullet.draw());

    requestAnimationFrame(gameLoop);
}

gameLoop();
