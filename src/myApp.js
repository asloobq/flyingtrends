/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var EXPLODE_FILE = "res/explode.mp3";

var Helloworld = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    mPausedLabel:null,
    circle:null,
	batchNode:null,
	ship:null,
	mBgImage:null,
	pipe:null,
	pipe2:null,
	heli:null,
	count:100,
	data:null,
	speed:2,
    	heliSpeed:2,
    heliAnimation:null,
    mIsRunning:true,
    mIsGameOver:false,
    mRestartButton:null,
    mPauseButton:null,
    mMenu:null,
    lazyLayer:null,
    mAudioEngine:null,
    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
	
	mAudioEngine = cc.AudioEngine.getInstance();
        // set default volume
        mAudioEngine.setEffectsVolume(0.5);
        mAudioEngine.setMusicVolume(0.5);
	cc.AudioEngine.getInstance().preloadEffect(EXPLODE_FILE);
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

		this.mBgImage = cc.Sprite.create(s_Clouds);
		this.mBgImage.setPosition(size.width/2, size.height/2);
		this.addChild(this.mBgImage);
		
	this.mPauseButton = cc.MenuItemSprite.create(cc.Sprite.create(s_Pause));
	this.mPauseButton.setPosition(size.width - 40, size.height - 40);
	this.mPauseButton.setCallback(this.onPause, this);
	this.mMenu = cc.Menu.create(this.mPauseButton);
	this.mMenu.setPosition(0,0);
	this.addChild(this.mMenu, 1);

        this.lazyLayer = cc.Layer.create();
        this.addChild(this.lazyLayer);
 
	this.pipe = new Array();
	this.pipe2 = new Array();
	this.data = new Array();

	this.heli = cc.Sprite.create(s_Heli1);
	this.lazyLayer.addChild(this.heli, 1);
	
	
	for(var i = 0; i < this.count; i++) {
		this.pipe[i] = cc.Sprite.create(s_Pipe1);
		this.lazyLayer.addChild(this.pipe[i], 1);
		this.pipe[i].setScale(0.1);
		//this.pipe[i].setAnchorPoint(1, 0.5);
	}
	for(var i = 0; i < this.count; i++) {
		this.pipe2[i] = cc.Sprite.create(s_Pipe2);
		this.lazyLayer.addChild(this.pipe2[i], 1);
		this.pipe2[i].setScale(0.1);
	}
	this.onRestart();	
        this.setTouchEnabled(true);
	this.setKeyboardEnabled(true);
	this.scheduleUpdate();
        return true;
    },
    buildAnimation:function() {
	    //Not working
	//create an animation object
	var animation = cc.Animation.create();

	//add a sprite frame to this animation
	animation.addFrameWithFile("heli.png");

	animation.addFrameWithFile("heli2.png");
	
	animation.setDelayPerUnit(2);

	//create an action with this animation
	var animate = cc.Animate.create(animation);

	//run animate
	this.heli.runAction(cc.RepeatForever.create(animate));
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
	//this.heli.setPositionY(this.heli.getPositionY() + (this.speed * 20));
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    },
	update:function (dt) {
		//if game is running then call update on pipe
		if(this.mIsRunning) {
			for(var i = 0; i < this.count; i++) {
				this.pipe[i].setPositionX(this.pipe[i].getPositionX() - this.speed);
				this.pipe2[i].setPositionX(this.pipe2[i].getPositionX() - this.speed);			
			}
			if (this.isMouseDown) {
				this.heli.setPositionY(this.heli.getPositionY() + this.heliSpeed);
			} else {
				this.heli.setPositionY(this.heli.getPositionY() - this.heliSpeed);
			}
			this.checkCollision();
		}
	},
	 handleTouch:function(touchLocation)
    {
       // if(touchLocation.x < 300)
        //    this._currentRotation = 0;
        //else
        //    this._currentRotation = 180;
	console.log("handleTouch x = ", touchLocation.x);
    },
    checkCollision:function() {
	heliRect = this.heli.getBoundingBox();
	for(var i = 0; i < this.count; i++) {
		pipe1Rect = this.pipe[i].getBoundingBox();
		if (cc.rectIntersectsRect(heliRect, pipe1Rect)) {
			console.log("checkCollision collision with i = ", i);
			this.onCollision();
			return;
		}
		pipe2Rect = this.pipe2[i].getBoundingBox();
		if (cc.rectIntersectsRect(heliRect, pipe2Rect)) {
			console.log("checkCollision collision with i = ", i);
			this.onCollision();
			return;
		}
	}
    },
    onCollision:function() {
    	//this.mAudioEngine.playEffect(EFFECT_FILE);
	cc.AudioEngine.getInstance().playEffect(EXPLODE_FILE);
	this.heli.setVisible(false);
	this.mIsRunning = false;
	this.onGameOver();
    },
    onGameOver:function() {
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("GAME OVER", "Arial", 38);
        // position the label on the center of the screen
	var size = cc.Director.getInstance().getWinSize();
        this.helloLabel.setPosition(size.width / 2, size.height / 2);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

	this.mRestartButton = cc.MenuItemSprite.create(cc.Sprite.create(s_Restart));
	this.mRestartButton.setScale(0.5);
	this.mRestartButton.setCallback(this.onRestart, this);
	this.mRestartButton.setPosition(size.width/2, size.height/2 - 35);
	this.mMenu.addChild(this.mRestartButton);
        this.mIsGameOver = true;
    },
    onRestart:function() {
	    console.log("restart");
	    var size = cc.Director.getInstance().getWinSize();
	    for(var i = 0; i < this.count; i++) {
			this.data[i] = Math.floor((Math.random() * 200) + 1);
		}
	    for(var i = 0; i < this.count; i++) {
		this.pipe[i].setPosition(size.width/2 + (18 * i), this.data[i]);
		}
		
	    for(var i = 0; i < this.count; i++) {
		this.pipe2[i].setPosition(size.width/2 + (18 * i), this.data[i] + size.height*.75);
	    }
	    this.mIsRunning = true;
	    this.mIsGameOver = false;
	    this.heli.setVisible(true);
	    this.heli.setPosition(size.width/4, size.height/2);
	    this.mMenu.removeChild(this.mRestartButton);
	    this.removeChild(this.helloLabel);
    },
    onPause:function() {
	    console.log("onPause");
	    if(this.mIsGameOver) {
		    return;
	    }
	if(this.mIsRunning) {
		this.mIsRunning = false;
		        // create and initialize a label
	        this.mPauseLabel = cc.LabelTTF.create("PAUSED", "Arial", 38);
        	// position the label on the center of the screen
		var size = cc.Director.getInstance().getWinSize();
	        this.mPauseLabel.setPosition(size.width / 2, size.height / 2);
	        // add the label as a child to this layer
	        this.addChild(this.mPauseLabel, 5);

	} else {
		this.mIsRunning = true;
		this.removeChild(this.mPauseLabel);
	}
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});

