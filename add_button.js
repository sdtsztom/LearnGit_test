function tlef_onJumpClicked(){
	//objApp.ExecutePlugin('21f8dbe0-2271-4ba4-b442-29d124fadff6');

	var path=objApp.GetPluginPathByScriptFileName('add_button.js');
	//objWindow.ShowHtmlDialog('',path+'jump.html',500,500,'');
	objWindow.ShowHtmlDialogEx(false, "Jump", path+'jump.html', 300, 100, "", null, null);
}

function tlef_onClassifyClicked(){
	//objApp.ExecutePlugin('71d7c173-dbe0-4a20-8e81-18d50b382273');

	var path=objApp.GetPluginPathByScriptFileName('add_button.js');
	objApp.RunScriptFile(path+'classify.js','javascript');
}

function tlef_init(){
/*	var str_jump=objApp.TranslateString('Jump');
	var str_classify=objApp.TranslateString('Classify');*/

	var path=objApp.GetPluginPathByScriptFileName('add_button.js');
	var str_jump=objApp.LoadStringFromFile(path+'plugin.ini','strJump');
	var str_classify=objApp.LoadStringFromFile(path+'plugin.ini','strClassify');

	objWindow.AddToolButton('main','jump',str_jump,'','tlef_onJumpClicked');
	objWindow.AddToolButton('main','classify',str_classify,'','tlef_onClassifyClicked');
}

tlef_init();