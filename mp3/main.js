var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdthumd = $('.cd-thumb');
const audio = $('#audio')
const cd = $('.cd');
const playbtn = $('.btn-toggle-play')
const player = $('.player')
const progre = $('#progress')
const nextbtn = $('.btn-next')
const prevbtn = $('.btn-prev')
const randombtn = $('.btn-random')
const repeatbtn = $('.btn-repeat')
const playlist = $('.playlist');
const Play_mp3 = 'MP3'
var app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(Play_mp3)) || {
        isRepeat: false,
        isRandom: false,
    },
    songs: [{
            name: "Yêu là cưới",
            singer: "Phát Hồ",
            path: "https://vnso-zn-24-tf-mp3-s1-zmp3.zadn.vn/6999d08d34cbdd9584da/5996810896779078482?authen=exp=1632127631~acl=/6999d08d34cbdd9584da/*~hmac=041484ceaac2d3cd7c361a46e3118aa4&fs=MTYzMTk1NDgzMTmUsICzM3x3ZWJWNnwwfDI3LjY0LjE1MC4xNzA",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Yêu là cưới 1",
            singer: "Phát Hồ",
            path: "https://vnso-zn-24-tf-mp3-s1-zmp3.zadn.vn/6999d08d34cbdd9584da/5996810896779078482?authen=exp=1632127631~acl=/6999d08d34cbdd9584da/*~hmac=041484ceaac2d3cd7c361a46e3118aa4&fs=MTYzMTk1NDgzMTmUsICzM3x3ZWJWNnwwfDI3LjY0LjE1MC4xNzA",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        }, {
            name: "Yêu là cưới 2",
            singer: "Phát Hồ",
            path: "https://vnso-zn-24-tf-mp3-s1-zmp3.zadn.vn/6999d08d34cbdd9584da/5996810896779078482?authen=exp=1632127631~acl=/6999d08d34cbdd9584da/*~hmac=041484ceaac2d3cd7c361a46e3118aa4&fs=MTYzMTk1NDgzMTmUsICzM3x3ZWJWNnwwfDI3LjY0LjE1MC4xNzA",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        }, {
            name: "Yêu là cưới 3",
            singer: "Phát Hồ",
            path: "https://vnso-zn-24-tf-mp3-s1-zmp3.zadn.vn/6999d08d34cbdd9584da/5996810896779078482?authen=exp=1632127631~acl=/6999d08d34cbdd9584da/*~hmac=041484ceaac2d3cd7c361a46e3118aa4&fs=MTYzMTk1NDgzMTmUsICzM3x3ZWJWNnwwfDI3LjY0LjE1MC4xNzA",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        }

    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(Play_mp3, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `    <div class="song ${index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
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
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth // lấy chiều cao ban đầu của cd
            //  xử lý quay 
        const quay = cdthumd.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity

        })
        quay.pause()

        //sử lý khi click play
        playbtn.onclick = function() {
            nextbtn.onclick = function() {
                if (_this.isRandom) {
                    _this.randomSong()

                } else {
                    _this.nextsong();
                }
                audio.play()
                _this.render()
            }
            prevbtn.onclick = function() {
                    if (_this.isRandom) {
                        _this.randomSong()

                    } else {
                        _this.prevsong();

                    }
                    audio.play()
                    _this.render()
                }
                // tao mau cho icon random
            randombtn.onclick = function() {
                _this.isRandom = !_this.isRandom
                randombtn.classList.toggle('active', _this.isRandom)
                _this.setConfig('isRandom', _this.isRandom)
            }
            repeatbtn.onclick = function() {
                    _this.isRepeat = !_this.isRepeat
                    repeatbtn.classList.toggle('active', _this.isRepeat)
                    _this.setConfig('isRepeat', _this.isRepeat)
                }
                //phat nhac

            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                quay.play()
            }
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                quay.pause()
            }
            audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextbtn.click();
                }

            }
            playlist.onclick = function(e) {
                const nodesong = e.target.closest('.song:not(.active)')
                if (nodesong || e.target.closest('.option')) {
                    if (nodesong) {
                        _this.currentIndex = Number(nodesong.dataset.index)
                        _this.Loadcurrentsong();
                        _this.render()
                        audio.play();

                    }
                    if (e.target.closest('.option')) {

                    }
                }
            }

        }

        //sử lý phóng to thu nhỏ
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.screenTop //lấy kích thước lăn con chuột
            const newCdWith = cdWidth - scrollTop // lấy ta chiề cao cd khi lăn con chuột
            cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0;
            cd.style.opacity = newCdWith / cdWidth;
        }


        // sử lý thời gian trong thanh tua
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progress = Math.floor(audio.currentTime / audio.duration * 100)
                progre.value = progress
            }
        }
        progre.onchange = function(e) {
            const time = Math.floor(audio.duration * e.target.value / 100);
            audio.currentTime = time
        }
    },
    Loadcurrentsong: function() {


        heading.textContent = this.currentSong.name
        cdthumd.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextsong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.Loadcurrentsong();
    },
    prevsong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.Loadcurrentsong();
    },

    randomSong: function() {
        let newrandom
        do {
            newrandom = Math.floor(Math.random() * this.songs.length)
        } while (newrandom === this.currentIndex);
        this.currentIndex = newrandom
        this.Loadcurrentsong();
    },
    start: function() {
        this.loadconfig() // 
        this.handleEvents(); //lắng nghe sử lý sự kiện
        this.defineProperties(); // định nghĩ thuộc tính
        this.render() //views danh sách
        this.Loadcurrentsong()

        repeatbtn.classList.toggle('active', this.isRepeat)
        randombtn.classList.toggle('active', this.isRandom)
    },
    loadconfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
}

app.start();