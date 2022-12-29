const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'ZING_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $(' .btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')





const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Nevada",
            singer: "Vicetone",
            path: "../music/Vicetone  Nevada ft Cozi Zuehlsdorff.mp3",
            image: "https://i.ytimg.com/vi/AnMhdn0wJ4I/0.jpg",
        },
        {
            name: "Waiting For Love",
            singer: "Avicii",
            path: "../music/Song1.mp3",
            image: "https://yt3.googleusercontent.com/ytc/AMLnZu9gtZe7Pd12rB7dlZP1u0BQ0Po8Py3-_JHLfNypyA=s900-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Head In The Clouds",
            singer: "Hayd",
            path: "../music/Head In The Clouds.mp3",
            image: "https://thehiddenhits.files.wordpress.com/2021/05/hayd-the-hidden-hits.png?w=1200",
        },
        {
            name: "Mary On A Cross",
            singer: "Ghost",
            path: "../music/Mary On A Cross.mp3",
            image: "https://consequence.net/wp-content/uploads/2022/09/ghost-mary-on-a-cross-billboard.jpg?quality=80",
        },
        {
            name: "Reality ",
            singer: "Lost Frequencies",
            path: "../music/Reality  Lost Frequencies Lyrics.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/singer/avatar/2018/12/26/6/1/c/8/1545810387947_600.jpg",
        },
        {
            name: "Waiting For You",
            singer: "Mono",
            path: "../music/WaitingForYou-MONOOnionn-7733882.mp3",
            image: "https://i.ytimg.com/vi/CHw1b_1LVBA/maxresdefault.jpg",
        },
        {
            name: "  Sonic Blaster",
            singer: "Nightcore ",
            path: "../music/y2mate.com - Nightcore  Sonic Blaster.mp3",
            image: "https://i.ytimg.com/vi/CHw1b_1LVBA/maxresdefault.jpg",
        },
        {
            name: "   The Calling feat Laura Brehm ",
            singer: "TheFatRat ",
            path: "../music/y2mate.com - TheFatRat  The Calling feat Laura Brehm.mp3",
            image: "https://i.ytimg.com/vi/CHw1b_1LVBA/maxresdefault.jpg",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    // render html playlist
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,  //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử Lý khi click play 
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // khi song được play 
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // khi song bị pause 
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        // Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Xử lí khi tua song 
        progress.oninput = function (e) {
            const seekTIme = audio.duration / 100 * e.target.value
            audio.currentTime = seekTIme
        }

        // Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.nextSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài hát 
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            // _this.prevSong()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        // Xử lý bật / tắt random songs
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)

        }

        // Xử lý lặp lại một song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRandom', _this.isRandom)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended 
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {

                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                // Xử lý khi click vào song option
                if (e.target.closest('.option')) {

                }
            }
        }

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

        // Object.assign(this, this.config)
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong();

    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // Định nghĩa các thuộc tính trong object
        this.defineProperties()

        // lắng nghe // xử lí các sự kiện (DOM evnets) 
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist 
        this.render()

        //  Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', _this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat)
    }
};

app.start()
