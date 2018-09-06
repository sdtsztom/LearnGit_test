var objApp=WizExplorerApp;
var objDatabase=objApp.Database;
var objWindow=objApp.Window;
var cur_doc=objWindow.CurrentDocument;
var err_msg='';

function print_err(){
	objWindow.ShowMessage(err_msg,'error',0x40);
}

function get_sign(){
	var cur_title=cur_doc.Title ;
	var index=cur_title.indexOf('-',0);
	if(index!=-1)return cur_title.substr(0,index);
	else{
		err_msg='can not find \'-\' in the title';
		return 0;
	}
}

function get_doc_content(){
	var doc_collection=objDatabase.DocumentsFromTitle('set_effi_tool',1);
	if(doc_collection){
		var set_doc=doc_collection.Item(0);
		var doc_content=set_doc.GetText(1000);
		return doc_content;
	}else{
		err_msg='can not find set file!';
		return 0;
	}
}

function get_set_content(set_type){
	if(set_type!='classify')return 0;
	var doc_content=get_doc_content();
	if(doc_content){
		var classify_index=doc_content.indexOf('[classify]',0);
		var jump_index=doc_content.indexOf('[jump]',0);
		if(classify_index==-1)return '';
		else{
			var set_content='';
			if(jump_index==-1)set_content=doc_content;
			else set_content=doc_content.substr(classify_index,jump_index-classify_index);
			return set_content;
		}
	}else{
		err_msg='blank set file content!';
		return 0;
	}
}

function move(set_content,sign){
	var sign_index=set_content.indexOf(sign,0);
	var loc='';
	if(sign_index!=-1){
		var loc_start=set_content.indexOf('=',sign_index)+1;
		var loc_end=set_content.indexOf(';',sign_index);
		var loc=set_content.substr(loc_start,loc_end-loc_start);
		if(loc.indexOf(' ')!=-1)loc=loc.replace(/ /g,'');
		if(loc.indexOf('#')!=-1)loc=loc.replace('#',' ');
		var folder=objDatabase.GetFolderByLocation(loc,false);
		if(folder){
			cur_doc.MoveTo(folder);
			return 1;
		}else{
			err_msg='can not find any matched folder!';
			return 0;
		}
	}else{
		err_msg='can not find any matched sign!';
		return 0;
	}
}

function remove_sign(sign){
	var title=cur_doc.Title;
	var real_title_start=sign.length+2;
	var real_title_end=title.length;
	cur_doc.Title=title.substr(real_title_start,real_title_end-real_title_start);
}


function exec_classify(){
	var set_content=get_set_content('classify');
	if(set_content){
		var sign=get_sign();
		if(sign){
			var if_remove_sign=false;
			if(sign[0]=='@'){
				if_remove_sign=true;
				sign=sign.substr(1,sign.length-1);
			}
			if(set_content!=''&&sign!=''){
				var flag_move=move(set_content,sign);
				if(flag_move){
					if(if_remove_sign)remove_sign(sign);
					return 1;
				}else return 0;
			}else{
				err_msg='blank set_content or sign!';
				return 0;
			}
		}else return 0;
	}else return 0;
}

if(cur_doc){
	var flag_exec=exec_classify();
	if(!flag_exec)print_err();
}
else{
	err_msg='no current_doc!';
	print_err();
}