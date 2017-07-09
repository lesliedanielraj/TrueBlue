var simon = {
    level: 1,
    skill: 1,
    active: false,
    handler: false,
    shape: '.shape',
    playIndex: 1,
    turn: 1,
    simonSequence: [],
    currentSimonSequence: [],
    playerSequence: [],
    lastSequence: [],
    longSequence: [],
    skillSequence: [8, 14, 20, 31],
    curSpeed: 600,

    init: function () {
        if (this.handler === false) {
            this.initializeLenses();
            this.initializeLast();
            this.initializeStart();
            this.initializeLong();
            this.initializeLevel();
            this.initializeSkill();
        }
    },
    initializeLenses: function () {
        that = this;
        $('.lens').on('mouseup', function () {
            if (that.active === true) {
                var lens = parseInt($(this).data('pad'), 10);
                that.flash($(this), 1, 300, lens);
                that.playerSequence.push(lens);
                that.checkSequence(lens);
            }
        });
    },
    initializeLast: function () {
        that = this;
        $('#round-btn-last').click(function () {
            if (that.active === true) {
                that.displayLastSequence();
            }
        });
    },
    initializeStart: function () {
        that = this;
        $('#round-btn-start').click(function () {
            if (that.active === true) {
                that.simonSequence = [];
                that.initializeSimonSequence(that.skill);
                that.playIndex = 1;
                that.turn = 1;
                that.playerSequence = [];
                that.playGame();
            }
        });
    },
    initializeLong: function () {
        that = this;
        $('#round-btn-long').click(function () {
            if (that.active === true) {
                that.displayLongSequence();
            }
        });
    },
    initializeLevel: function () {
        that = this;
        $("#levelSlider").on("change", function () {
            $('#levelSliderValue').html("Level " + this.value);
            that.level = this.value;
        }).trigger("change");
    },
    initializeSkill: function () {
        that = this;
        $("#skillSlider").on("change", function () {
            $('#skillSliderValue').html("Skill " + this.value);
            that.skill = this.value;
        }).trigger("change");
    },

    //Initialize Simon Sequence for the game
    initializeSimonSequence: function (currentLevel) {
        that = this;
        for (i = 0; i < that.skillSequence[currentLevel - 1]; i++) {
            that.simonSequence.push(Math.floor(Math.random() * 4) + 1);
        }
    },
    setLastSequence: function () {
        that = this;
        that.lastSequence = that.playerSequence;
    },
    setLongSequence: function () {
        that = this;
        if (that.longSequence.length <= that.playerSequence.length) {
            that.longSequence = that.playerSequence;
        }
    },
    playGame: function () {
        that = this;
        that.currentSimonSequence = [];
        for (var i = 0; i < that.playIndex; i++) {
            that.currentSimonSequence.push(that.simonSequence[i]);
        }
        that.displayCurrentSimonSequence();
    },
    checkSequence: function (lens) {
        that = this;
        if (lens !== this.currentSimonSequence[this.turn - 1]) {
            this.playErrorSound(lens);
        } else {
            this.turn++;
        }
        if (this.playIndex === this.simonSequence.length) {
            if (this.playIndex === this.turn - 1) {
                this.flash($(this.shape + lens), 6, 200, lens);

                this.setLastSequence();
                this.setLongSequence();
            }
        }
        else if (this.turn - 1 === this.playIndex) {
            this.turn = 1;
            this.playIndex++;
            this.playerSequence = [];
            this.playGame();
        }
    },


    //Flash Lens
    flash: function (element, times, speed, pad) {
        var that = this;
        if (times > 0) {
            that.playSound(pad);
            element.stop().animate({ opacity: '1' }, {
                duration: 50,
                complete: function () {
                    element.stop().animate({ opacity: '0.6' }, 200);
                }
            });
        }
        if (times > 0) {
            setTimeout(function () {
                that.flash(element, times, speed, pad);
            }, speed);
            times -= 1;
        }
    },
    //Play Sound for Lens Flash
    playSound: function (clip) {
        var sound = $('.sound' + clip)[0];
        console.log(sound);
        console.log($('.sound' + clip));
        sound.currentTime = 0;
        sound.play();
    },
    playErrorSound: function (clip) {
        var sound = $('.error' + clip)[0];
        console.log(sound);
        console.log($('.error' + clip));
        sound.currentTime = 0;
        sound.play();
    },

    //Display Current Simon Sequence
    displayCurrentSimonSequence: function () {
        var that = this;
        if (that.playIndex <= 5) {
            that.curSpeed = 800;
        }
        else if (that.playIndex <= 9) {
            that.curSpeed = 600;
        }
        else if (that.playIndex <= 13) {
            that.curSpeed = 400;
        }
        else {
            that.curSpeed = 600;
        }

        setTimeout(function () {
            $("#myName").val("LeslieDanielRaj");
        }, 5000);


        $.each(this.currentSimonSequence, function (index, val) {
            setTimeout(function () {
                that.flash($(that.shape + val), 1, that.curSpeed, val);
            }, that.curSpeed * 1.5 * index);
        });
    },

    //Display Last Sequence
    displayLastSequence: function () {
        var that = this;
        $.each(this.lastSequence, function (index, val) {
            setTimeout(function () {
                that.flash($(that.shape + val), 1, 300, val);
            }, 600 * index);
        });
    },

    //Display Long Sequence
    displayLongSequence: function () {
        var that = this;
        $.each(this.longSequence, function (index, val) {
            setTimeout(function () {
                that.flash($(that.shape + val), 1, 300, val);
            }, 600 * index);
        });
    }
};
$(document).ready(function () {
    $('#myonoffswitch').click(function () {
        if ($(this).prop("checked") == true) {
            simon.active = true;
            simon.init();

            //Enable Buttons
            $(".roundButtons").removeAttr('disabled');
            $(".range-slider__range").removeAttr('disabled');
        }
        else {
            simon.active = false;

            //Disable Buttons
            $('.roundButtons').prop("disabled", true);
            $('.range-slider__range').prop("disabled", true);
        }
    });
});

