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
var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        if(cc.RenderDoesnotSupport()){
            //show Information to user
            alert("Browser doesn't support WebGL");
            return false;
        }

        cc.EGLView.getInstance().resizeWithBrowserSize(true);
        cc.EGLView.getInstance().setDesignResolutionSize(800, 450, cc.RESOLUTION_POLICY.SHOW_ALL);

	    // initialize director
	    var director = cc.Director.getInstance();

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            director.replaceScene(new this.startScene());
        }, this);

		this.fetchBBData();
		
        return true;
    },
	fetchBBData:function () {
		
		//var url = "http://www.cs.binghamton.edu/~aquresh4/Misc/hackbu/";
		//var method = "POST";
		//var postData = "Some data";
		//this.postToUrl(url, method, postData);
		this.connectServer('149.125.231.116', '5383');
	},
	connectServer:function(url, portno) {
		
		var socket = new WebSocket('ws://149.125.231.116:5383');
		socket.onopen = function() {
			socket.send('hello');
		}
		
		socket.onmessage = function(reply) {
			console.log('reply = ', reply);
		}
	},
	 postToUrl:function (url, method, postData) {
		

		// You REALLY want async = true.
		// Otherwise, it'll block ALL execution waiting for server response.
		var async = true;

		var request = new XMLHttpRequest();

		// Before we send anything, we first have to say what we will do when the
		// server responds. This seems backwards (say how we'll respond before we send
		// the request? huh?), but that's how Javascript works.
		// This function attached to the XMLHttpRequest "onload" property specifies how
		// the HTTP response will be handled. 
		request.onload = function () {

		   // Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
		   // object declared above is available in this function even though this function
		   // executes long after the request is sent and long after this function is
		   // instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
		   // applications.

		   // You can get all kinds of information about the HTTP response.
		   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
		   var data = request.responseText; // Returned data, e.g., an HTML document.
		   //console.log("response status= ", status);
		   console.log("response data= ", data);
		}

		request.open(method, url, async);

		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		// Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
		// Or... whatever

		// Actually sends the request to the server.
		request.send(postData);
	},
});
var myApp = new cocos2dApp(HomeScene);
