/**
 * @author Caspar Addyman
 * 
 * The personal data and privacy settinhs screen 
 * 
 * Copyright yourbrainondrugs.net 2011
 */

(function() {
	
	// create tab group
	var tabGroup = Titanium.UI.createTabGroup({id:'tabGroupMyData'});
	
	//
	// create tab for personal / demographic data
	//
	var winpers = Titanium.UI.createWindow({ modal:true,
		url: '/win/win_personal.js',
		titleid: 'win_personal',
		backgroundImage:'/images/smallcornercup.png'
	});
	var tabpers = Titanium.UI.createTab({
		title:'Personal Data',
	    window:winpers
	});
	
	
	// create tab for privacy settings
	//
	var winprivacy = Titanium.UI.createWindow({ modal:true,
	    url:'/win/win_privacy.js',
		titleid:'win_privacy',
		backgroundImage:'/images/smallcornercup.png'
	});
	var tabprivacy = Titanium.UI.createTab({
		title:'Privacy settings',
	    window:winprivacy
	});

	//  
	// create tab for registration settings
	// TODO
	// only show this tab if needed.
	var winregister = Titanium.UI.createWindow({ modal:true,
	    url:'/win/win_register.js',
		titleid:'win_register',
		backgroundImage:'/images/smallcornercup.png'
	});
	var tabregister = Titanium.UI.createTab({
		title:'Register',
	    window:winregister
	});
	
	
	//  
	// create tab for login
	// TODO
	// only show this tab if needed.
	var winlogin = Titanium.UI.createWindow({ modal:true,
	    url:'/win/win_login.js',
		titleid:'win_login',
		backgroundImage:'/images/smallcornercup.png'
	});
	var tablogin = Titanium.UI.createTab({
		title:'Log In',
	    window:winlogin
	});
	
	
	//
	//  add tabs
	//
	tabGroup.addTab(tabpers);
	tabGroup.addTab(tabprivacy);
	tabGroup.addTab(tabregister);
	tabGroup.addTab(tablogin)
	//
	
	tabGroup.setActiveTab(0); 
	tabGroup.open();
	
	// Cleanup and return home
	tabGroup.addEventListener('android:back', function(e) {
		if (Ti.App.boozerlyzer.winHome === undefined 
			 || Ti.App.boozerlyzer.winHome === null) {
			Ti.App.boozerlyzer.winHome = Titanium.UI.createWindow({ modal:true,
				url: '/app.js',
				title: 'Boozerlyzer',
				backgroundImage: '/images/smallcornercup.png',
				orientationModes:[Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT]  //Landscape mode only
			})
		}
		win.close();
		Ti.App.boozerlyzer.winHome.open();
	});
})();