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

var HomeLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    startButton:null,
    optionsButton:null,
    creditsButton:null,
	mBgImage:null,
    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        /*var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(0.5, 0.5);

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(0,0);
        this.addChild(menu, 1);
        closeItem.setPosition(size.width - 20, 20);*/
		this.mBgImage = cc.Sprite.create(s_Clouds);
		this.mBgImage.setPosition(size.width/2, size.height/2);
		this.addChild(this.mBgImage);
        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("FLYING TRENDS", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, size.height/2 + 100);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

       

	this.startButton = cc.MenuItemSprite.create(cc.Sprite.create("res/start_button.png"));
	//this.startButton.setTarget(this, this.menuStartCallback);
	this.startButton.setCallback(this.menuStartCallback, this);
	this.optionsButton = cc.MenuItemSprite.create(cc.Sprite.create("res/options_button.png"));
	this.creditsButton = cc.MenuItemSprite.create(cc.Sprite.create("res/credits_button.png"));
	var menu = cc.Menu.create(this.startButton);
	menu.addChild(this.optionsButton);
	menu.addChild(this.creditsButton);
	menu.setPosition(size.width / 2, size.height/2);
	menu.alignItemsVerticallyWithPadding(50);
	this.addChild(menu, 1);
    //optionsButton:null,
    //creditsButton:null

        this.setTouchEnabled(true);
		this.setKeyboardEnabled(true);
        return true;
    },
    //start button callback
    menuStartCallback:function (sender) {
	console.log("start clicked");
	cc.Director.getInstance().replaceScene(new HelloWorldScene);
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

