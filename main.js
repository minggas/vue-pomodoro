/* jshint esversion:6 */
Vue.component('container', {
    template: `
    <div class="container">
    <div class="setter counter">
    <label for="wktime">
        <p>Work</p>
        <button class="minus" @click="minusTime" data-name="wk">-</button>
        <span class="work-time" id="wktime">{{ wk_minutes }}</span>
        <button class="plus" @click="plusTime" data-name="wk">+</button>
        </label>
        <label for="sbtime"><p>Short</p>
        <button class="minus" @click="minusTime" data-name="sb">-</button>
        <span class="short-break" id="sbtime">{{ sb_minutes }}</span>
        <button class="plus" @click="plusTime" data-name="sb">+</button>
        </label>
        <label for="lbtime"><p>Long</p>
        <button class="minus" @click="minusTime" data-name="lb">-</button>
        <span class="long-break" id="lbtime">{{ lb_minutes }}</span>
        <button class="plus" @click="plusTime" data-name="lb">+</button>
        </label>
    </div>
    
    <div class="timer">
        <div class="time">
            <span v-text="minutesShown"></span>
            <span>:</span>
            <span v-text="secondsShown"></span>
        </div>
        <div class="filler" v-bind:style="{height : fillerHeight+'px'}"></div>
    </div>
    <p class="counter">Pomodoros: {{ workCounter }}</p>
    <div class="buttons">
        <button class="start" v-on:click="startWork">Start</button>
        <button class="stop" v-on:click="stopTimer">{{ pauseBtn }}</button>
    </div>
</div>
    `,
    data: function () {
        return {
            wk_minutes: 25,
            sb_minutes: 5,
            lb_minutes: 15,
            minutes: 0,
            seconds: 0,
            interval: null,
            started: false,
            paused: true,
            fillerHeight: 0,
            fillerIncrement: 0,
            workCounter: 0,
            isWork: true,
            pauseBtn: 'Pause'
        };
    },
    methods: {
        resetVariables: function (mins, secs, started) {
            console.log(this);
            this.minutes = mins;
            this.seconds = secs;
            this.started = started;
            this.paused = false;
            this.fillerIncrement = 200 / (this.minutes * 60);
            this.fillerHeight = 0;
            this.interval = setInterval(this.intervalCallback, 1000);
        },
        startWork: function () {
            if(this.workCounter >= 4){
                this.resetVariables(this.lb_minutes, 0, true);                
            }else{
                this.resetVariables(this[this.isWork ?'wk_minutes':'sb_minutes'], 0, true);
            }            
        },
        stopTimer: function () {
            if(!this.started){
                return;
            }
            if (!this.paused) {
                clearInterval(this.interval);
                this.paused = true;
                this.pauseBtn = 'Resume';
            } else {
                this.interval = setInterval(this.intervalCallback, 1000);
                this.paused = false;
                this.pauseBtn = 'Pause';
            }
        },
        minusTime: function (e) {
            --this[e.target.dataset.name + '_minutes'];
        },
        plusTime: function (e) {
            ++this[e.target.dataset.name + '_minutes'];
        },
        intervalCallback: function () {
            console.log('teste');
            if (this.started) {
                if (this.seconds == 0) {
                    if (this.minutes == 0) {
                        this.timerComplete();
                        if(this.isWork){
                            ++this.workCounter;
                        }
                        this.isWork = !this.isWork;
                        return;
                    }
                    this.seconds = 59;
                    this.minutes--;
                } else {
                    this.seconds--;
                }
                this.fillerHeight = this.fillerHeight + this.fillerIncrement;
            }
        },
        timerComplete: function () {
            alert(this.isWork?'Time to rest':'Back to work');
            clearInterval(this.interval);
            this.started = false;
            this.fillerHeight = 0;
            this.paused = true;
            if(this.workCounter >= 4){
                this.workCounter = 0;
            }
        }
    },
    computed: {
        secondsShown: function () {
            if (this.seconds < 10) {
                return "0" + parseInt(this.seconds, 10);
            }
            return this.seconds;
        },
        minutesShown: function () {
            if (!this.started) {
                if (this.isWork) {
                    this.minutes = this.wk_minutes;
                } else{
                    if(this.workCounter >= 4){
                        this.minutes = this.lb_minutes;                    
                    } else {
                        this.minutes = this.sb_minutes;
                    }
                }
                 
            }
            if (this.minutes < 10) {
                return "0" + parseInt(this.minutes, 10);
            }
            return this.minutes;
        }
    }
});


new Vue({
    el: '#pomodoro-app'
});