/**
 * @author Caspar Addyman
 * 
 * The main high scores page.. 
 * eventually showing global & local high-scores
 *
 * 
 * Copyright yourbrainondrugs.net 2011
 */

var winHome;

exports.createApplicationWindow =function(){
	var win = Titanium.UI.createWindow({
		title:'YBOB Boozerlyzer',
		backgroundImage:'/images/smallcornercup.png',
		modal:true
	});	
		//include the menu choices	
	var menu = require('/ui/menu');
	//need to give it specific help for this screen
	menu.setHelpMessage("Click on game icons to show high scores for that game. Click on the icon in the top right corner to see current achievement level.");
	
win.activity.onCreateOptionsMenu = function(event){
		menu.createMenus(event);
	};
	
	var dbGameScores = require('/db/gameScores');
	var commSendData = require('/comm/sendData');
	win.orientationModes =  [Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];	
	//layout variables
	var sizeScoreIcon = 48,	sizeIcons = 66, selectedGameIdx = 0;	
	var subtypes = ['Total', 'Speed', 'Coordination', 'Accuracy','Alcohol'];
	var highicons = ['', 'rocket.png', 'astronaut_256.png', 'Angel.png','beer-full.png'];
	var lowicons = ['', 'snail.png', 'baby_icon.png','Devil.png','beer-empty.png'];
	var gameNames = ['Raccoon Hunt','Memory','Number Stroop', 'Pissonyms', 'Emotional Words', 'We feel fine'];
	var gameTypes = ['StatLearning','Memory','NumberStroop','Pissonyms', 'Emotions', 'WeFeelFine'];
	var choiceImgUrls = ['/icons/teddy_bears.png','/icons/Memory.png','/icons/numberStroop.png','/icons/Ice.png','/icons/emotionalwords.png','/icons/feelings.png'];

	var labelHighScores = Titanium.UI.createLabel({
		text:'High Scores',
		font:{fontSize:36,fontFamily:'sans-serif',fontWeight:'bold'},
		textAlign:'center',
		height:'auto',
		width:'auto',
		top:0,
		color:'green',
		zIndex:0,
	});
	win.add(labelHighScores);
	
	
	var highScores = Titanium.UI.createImageView({
		image:'/icons/Evolution.png',
		height:140,
		width:140*2.9,  //keep correct proportions
		opacity:0.3
	});
	win.add(highScores);

	var high = Ti.UI.createImageView({
		image:'/icons/' + highicons[1],
		height:sizeScoreIcon,
		width:sizeScoreIcon,
		top:0,
		left:0
	})
	win.add(high);
	
	var low = Ti.UI.createImageView({
		image:'/icons/' + lowicons[1],
		height:sizeScoreIcon,
		width:sizeScoreIcon,
		top:200,
		left:0	
	})
	win.add(low);
	
	
	var scrollChoices = Ti.UI.createScrollView({
		bottom:4,
		left:60,
		width:'auto',
		height:sizeIcons,
		contentHeight:'auto',
		contentWidth:'auto',
		showHorizontalScrollIndicator:true,
		showVerticalScrollIndicator:false
	});
	win.add(scrollChoices);
	
	function scrollChoiceClicked(events){
		selectedGameIdx = parseInt(events.source.idx,10);
		populateHighScores();
	}
	
	var leftPlace = 0;
	for(var i =0, iMax=choiceImgUrls.length;i<iMax;i++){
		var imgGame = Ti.UI.createImageView({
			idx:i,
			image:choiceImgUrls[i],
			width:sizeIcons,
			left:leftPlace,
			height:sizeIcons,
			top:0
		});
		imgGame.addEventListener('click',function(ev){
			scrollChoiceClicked(ev)
		});

		scrollChoices.add(imgGame);
		leftPlace += sizeIcons + 10;;
	}
	

	
	var footer = Ti.UI.createView({
		backgroundColor:'#111',
		height:30
	});
	
	var footerLabel = Ti.UI.createLabel({
		font:{fontFamily:'Helvetica Neue',fontSize:14,fontWeight:'normal'},
		text:'Submit to Server..',
		color:'#282',
		textAlign:'right',
		width:'auto',
		height:'auto'
	});
	footer.add(footerLabel);
	footer.addEventListener('click',function (){
		alert('Latest data sent to boozerlyzer.net.\nThank you.');
		commSendData.sync();
	});
	
	var header = Ti.UI.createView({
		backgroundColor:'#999',
		height:'auto'
	});
	var headerLabel = Ti.UI.createLabel({
		font:{fontFamily:'Helvetica Neue',fontSize:12,fontWeight:'bold'},
		text:'Number Stroop',
		color:'#222',
		textAlign:'center',
		top:0,
		left:4,
		width:'auto',
		height:30
	});
	header.add(headerLabel);
		
	var tv = Ti.UI.createTableView({
		height:220,
		width:220,
		headerView:header,
		footerView:footer,
		rowHeight:28
	});
	win.add(tv);
	
	function populateHighScores(){
		tv.data = [];
		headerLabel.text = gameNames[selectedGameIdx];
		var thisGameHighScores = dbGameScores.HighScores(gameTypes[selectedGameIdx],10);
		
		var len = thisGameHighScores.length;
		
		for(var i=0;i<len;i++){
			
			var row = Ti.UI.createTableViewRow({
		        height: 26,
		        className: 'oneScore'
		    });
		    var labelOneScore = Ti.UI.createLabel({
				text:(i+1) + ' - ' + thisGameHighScores[i].TotalScore.toFixed(0),
				top:0,
				left:32,
				textAlign:'left',
				color:'white',
				font:{fontSize:14,fontWeight:'bold'}
			});
			row.add(labelOneScore);

			tv.appendRow(row);
		}
	}

	populateHighScores();
	
	var labPoints = dbGameScores.TotalPoints(); 
	var levelUpDialog = require('/ui/levelUpDialog');
	var levelImg = levelUpDialog.getLevelImg(labPoints[0].Total);
	
	var showCurrentLevel = Titanium.UI.createImageView({
		image:levelImg,
		height:48,
		width:48,
		top:5,
		right:5,	    
		borderRadius:3,
	    borderWidth:2,
	    borderColor:'#111'
	});
	showCurrentLevel.addEventListener('click',function(){
		Ti.API.debug('high scores showCurrentLevel click');
		var labPoints =dbGameScores.TotalPoints(); 
		Ti.API.debug(JSON.stringify(labPoints));
		levelUpDialog.setParent(win);
		levelUpDialog.levelUp( labPoints[0].Total);
		levelUpDialog.addEventListener('close', function(e){
			setTimeout(function(){
					dialogOpen = false;
				}, 1000);
			});
		levelUpDialog.open();
	});
	win.add(showCurrentLevel);
	
	//TODO
	//There ought to be a simple way of wrapping this up as a UI element rather than repeating code in 
	//every win_.js file but i tried it a few ways and i never got it to work. but i am quite stupid.
	function goHome(){
		if (!winHome) {
			var winmain = require('/win/win_main');
			winHome = winmain.createApplicationWindow();
		}
		win.close();
		winHome.open();
		winHome.refresh();
	}
	//invisible button to return home over the cup
	var homeButton = Titanium.UI.createView({
								image:'/icons/transparenticon.png',
								bottom:0,
							    left:0,
							    width:30,
							    height:60
						    });
	win.add(homeButton);
	homeButton.addEventListener('click',goHome);
	// Cleanup and return home
	win.addEventListener('android:back', goHome);
	return win;
};
