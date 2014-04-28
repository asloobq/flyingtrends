/****************************************************************************
 Copyright (c) 2014 Asloob Qureshi


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

var GameLayer = cc.Layer.extend({
    isMouseDown:false,
    mScore:0,
    mScoreLabel:null,
    mPausedLabel:null,
	mBgImage:null,
	mGameOverImage:null,
	
    mPipes1:null,
	mPipes2:null,
	mHeli:null,
	mNoPipes:50,
	mDataPoints:null,
	mPipeSpeed:1.5,
    mHeliSpeed:1.5,
    mHeliAnimation:null,
    mIsRunning:true,
    mIsGameOver:false,
    mRestartButton:null,
    mPauseButton:null,
    mMenu:null,
    mLazyLayer:null,
    mAudioEngine:null,
    
    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
	
        //Initialise AudioEngine (not working)
	    mAudioEngine = cc.AudioEngine.getInstance();
        // set default volume
        mAudioEngine.setEffectsVolume(0.5);
        mAudioEngine.setMusicVolume(0.5);
	    cc.AudioEngine.getInstance().preloadEffect(EXPLODE_FILE);
       
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        //Set background image
		this.mBgImage = cc.Sprite.create(s_Clouds);
		this.mBgImage.setPosition(size.width/2, size.height/2);
		this.addChild(this.mBgImage);
		
        //Set Pause Button
	    this.mPauseButton = cc.MenuItemSprite.create(cc.Sprite.create(s_Pause));
	    this.mPauseButton.setPosition(size.width - 40, size.height - 40);
	    this.mPauseButton.setCallback(this.onPause, this);
	    this.mMenu = cc.Menu.create(this.mPauseButton);
	    this.mMenu.setPosition(0,0);
	    this.addChild(this.mMenu, 1);

        //Set Score label
        this.mScoreLabel = cc.LabelTTF.create(this.mScore, "Arial", 24);
        this.mScoreLabel.setPosition(size.width - 100, size.height - 40);
        this.addChild(this.mScoreLabel, 1);

        this.mLazyLayer = cc.Layer.create();
        this.addChild(this.mLazyLayer);
 
        //Initialize the pipes and data-points
	    this.mPipes1 = new Array();
	    this.mPipes2 = new Array();
	    this.mDataPoints = new Array();

	    this.mHeli = cc.Sprite.create(s_Heli1);
	    this.mHeli.setScale(0.4);
	    
	    this.mLazyLayer.addChild(this.mHeli, 1);
	
	    //Create pipes
	    for(var i = 0; i < this.mNoPipes; i++) {
		    this.mPipes1[i] = cc.Sprite.create(s_Pipe1);
		    this.mPipes1[i].setScale(0.1);
		    this.mLazyLayer.addChild(this.mPipes1[i], 1);
	    }

	    for(var i = 0; i < this.mNoPipes; i++) {
		    this.mPipes2[i] = cc.Sprite.create(s_Pipe2);
		    this.mPipes2[i].setScale(0.1);
		    this.mLazyLayer.addChild(this.mPipes2[i], 1);
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
	//animation.addFrameWithFile("heli.png");

	//animation.addFrameWithFile("heli2.png");
	
	animation.setDelayPerUnit(2);

	//create an action with this animation
	var animate = cc.Animate.create(animation);

	//run animate
	this.mHeli.runAction(cc.RepeatForever.create(animate));
    },


    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },


    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
	//this.heli.setPositionY(this.heli.getPositionY() + (this.mPipeSpeed * 20));
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
        var size = cc.Director.getInstance().getWinSize();
	
        if(this.mIsRunning) {
			for(var i = 0; i < this.mNoPipes; i++) {

				this.mPipes1[i].setPositionX(this.mPipes1[i].getPositionX() - this.mPipeSpeed);
				this.mPipes2[i].setPositionX(this.mPipes2[i].getPositionX() - this.mPipeSpeed);			
                
                if(this.mPipes1[i].getPositionX() < 0) {
                    this.mPipes1[i].setPositionX(size.width/2 + (15 * i));
                }
                
                if(this.mPipes2[i].getPositionX() < 0) {
                    this.mPipes2[i].setPositionX(size.width/2 + (15 * i));
                }
			}	

            //updateScore
            this.mScore += this.mPipeSpeed;
            if(this.mScore % 10 == 0) {
                this.mScoreLabel.setString(this.mScore);
            }
			
			if (this.isMouseDown) {
				this.mHeli.setPositionY(this.mHeli.getPositionY() + this.mHeliSpeed);
			} else {
				this.mHeli.setPositionY(this.mHeli.getPositionY() - this.mHeliSpeed);
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
	    heliRect = this.mHeli.getBoundingBox();
    
	    for(var i = 0; i < this.mNoPipes; i++) {
		    pipe1Rect = this.mPipes1[i].getBoundingBox();
		    if (cc.rectIntersectsRect(heliRect, pipe1Rect)) {
			    console.log("checkCollision collision with i = ", i);
			    this.onCollision();
			    return;
		    }
		    pipe2Rect = this.mPipes2[i].getBoundingBox();
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
	    this.mHeli.setVisible(false);
	    this.mIsRunning = false;
	    this.onGameOver();
    },


    onGameOver:function() {

        //Display game over message and show high scores
	    var size = cc.Director.getInstance().getWinSize();
      	this.mGameOverImage = cc.MenuItemSprite.create(cc.Sprite.create(s_Gameover));
	    this.addChild(this.mGameOverImage);
	    this.mGameOverImage.setPosition(size.width / 2, size.height / 2);
	
	    this.mRestartButton = cc.MenuItemSprite.create(cc.Sprite.create(s_Restart));
	    this.mRestartButton.setScale(0.5);
	    this.mRestartButton.setCallback(this.onRestart, this);
	    this.mRestartButton.setPosition(size.width/2, size.height/2 - 80);
	    this.mMenu.addChild(this.mRestartButton);
        this.mIsGameOver = true;
        this.mScore = 0;

    },


    onRestart:function() {
	    console.log("restart");
	    var size = cc.Director.getInstance().getWinSize();
	    
        //Move pipes to original posiiton
        for(var i = 0; i < this.mNoPipes; i++) {
			this.mDataPoints[i] = Math.floor((Math.random() * 180) + 1);
		}
	
        for(var i = 0; i < this.mNoPipes; i++) {
		    this.mPipes1[i].setPosition(size.width/2 + (15 * i), this.mDataPoints[i]);
		}
		
	    for(var i = 0; i < this.mNoPipes; i++) {
		    this.mPipes2[i].setPosition(size.width/2 + (15 * i), this.mDataPoints[i] + size.height*.75);
	    }

	    this.mIsRunning = true;
	    this.mIsGameOver = false;
	    this.mHeli.setVisible(true);
	    this.mHeli.setPosition(size.width/4, size.height/2);
	    this.mMenu.removeChild(this.mRestartButton);
	    this.removeChild(this.mGameOverImage);
        this.mScore = 0;
        this.mScoreLabel.setString(0);
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

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);
    }
});

