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

var HomeLayer = cc.Layer.extend({
    isMouseDown:false,
    mStartButton:null,
    mOptionsButton:null,
    mCreditsButton:null,
	mBgImage:null,
	mLogoImage:null,


    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        var size = cc.Director.getInstance().getWinSize();
    
        //Set background image
		this.mBgImage = cc.Sprite.create(s_Clouds);
		this.mBgImage.setPosition(size.width/2, size.height/2);
		this.addChild(this.mBgImage);
		
        //Set Game title
		this.mLogoImage = cc.Sprite.create(s_Logo);
		this.mLogoImage.setPosition(size.width/2 + 20, size.height-80);
		this.addChild(this.mLogoImage);

        //Add start button
	    this.mStartButton = cc.MenuItemSprite.create(cc.Sprite.create(s_StartButton));
	    
	    this.mStartButton.setCallback(this.menuStartCallback, this);
	    
        //Add options button
        this.mOptionsButton = cc.MenuItemSprite.create(cc.Sprite.create(s_OptionsButton));

        //Add credits button
	    this.mCreditsButton = cc.MenuItemSprite.create(cc.Sprite.create(s_CreditsButton));
	    
        //Put the buttons in a menu
        var menu = cc.Menu.create(this.mStartButton);
	    menu.addChild(this.mOptionsButton);
	    menu.addChild(this.mCreditsButton);
	    menu.setPosition(size.width / 2, size.height/2);
	    menu.alignItemsVerticallyWithPadding(20);
	    this.addChild(menu, 1);

        this.setTouchEnabled(true);
		this.setKeyboardEnabled(true);
        return true;
    },


    //start button callback
    menuStartCallback:function (sender) {
	console.log("start clicked");
        //Start Game Scene
	    cc.Director.getInstance().replaceScene(new GameScene);
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


	 handleTouch:function(touchLocation)
    {
		//console.log("handleTouch x = ", touchLocation.x);
    }
});

var HomeScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HomeLayer();
        layer.init();
        this.addChild(layer);
    }
});

