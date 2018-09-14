var objApp=WizExplorerApp;
var objDatabase=objApp.Database;
var objWindow=objApp.Window;
var cur_doc=objWindow.CurrentDocument;

function print_err(err_msg){
	objWindow.ShowMessage(err_msg,'error',0x40);
}

function convert2blankspace(str){
	if(str.indexOf(' ')!=-1)str=str.replace(/ /g,'');
	if(str.indexOf('#')!=-1)str=str.replace('#',' ');
	return str;	
}

function get_setdoc(){
	var doc_collection=objDatabase.DocumentsFromTitle('set_effi_tool',1);
	if(doc_collection){
		var set_doc=doc_collection.Item(0);
		var set_doc_content=set_doc.GetText(1000);
		return set_doc_content;
	}else{print_err('cannot find the set file!');return 0;}
}

function get_rules_content(rule_type){
	if(rule_type!='classify')return 0;
	var set_doc_content=get_setdoc();
	if(set_doc_content){
		var classify_index=set_doc_content.indexOf('[classify]',0);
		var jump_index=set_doc_content.indexOf('[jump]',0);
		if(classify_index==-1)return '';
		else{
			var rules_content='';
			if(jump_index==-1)rules_content=set_doc_content;
			else rules_content=set_doc_content.substring(classify_index,jump_index);
			return rules_content;
		}
	}else{print_err('invalid set_doc_content!');return 0;}
}

function gen_rules_map(rules_content){
	var rules_map=new Map();
	var index=0;
	var eq,key_start,value_end;
	while(true){
		key_start=rules_content.indexOf('\'',index)+1;
		if(!key_start)break;
		eq=rules_content.indexOf('=',key_start);
		value_end=rules_content.indexOf('\'',eq);
		rules_map.set(convert2blankspace(rules_content.substring(key_start,eq)),convert2blankspace(rules_content.substring(eq+1,value_end)));
		index=value_end+1;
	}
	return rules_map;
}

function move(rules_map,title){
	var best_matched_key='';
	var best_matched_key_length=0;

	for(var key of rules_map.keys()){
		if(key.length>best_matched_key_length&&title.indexOf(key,0)!=-1){
			best_matched_key=key;
			best_matched_key_length=key.length;
		}
	}

	if(best_matched_key_length!=''){
		var folder=objDatabase.GetFolderByLocation(rules_map.get(best_matched_key),false);
		if(folder){
			cur_doc.MoveTo(folder);
			return best_matched_key;
		}else{print_err('cannot find folder by best_matched_key!');return 0;}
	}else{print_err('no matched key!');return 0;}
}

function remove_key(title,key){
	var start=key.length;
	var end=title.length;
	cur_doc.Title=title.substring(start,end);
}


function exec_classify(title){
	var rules_content=get_rules_content('classify');
	if(rules_content){
		var rules_map=gen_rules_map(rules_content);
		var if_remove_key=false;
		if(title[0]=='@'){
			if_remove_key=true;
			title=title.substr(1,title.length-1);
		}
		if(rules_content!=''&&title!=''){
			var best_matched_key=move(rules_map,title);
			if(best_matched_key){
				if(if_remove_key)remove_key(title,best_matched_key);
				return 1;
			}else{print_err('invalid best_matched_key!');return 0;}
		}else{print_err('blank rules_content or title!');return 0;}
	}else{print_err('invalid rules_content!');return 0;}
}

if(cur_doc){
	var title=cur_doc.Title;
	if(title) var flag_exec=exec_classify(title);
	else print_err('invalid title!');
}else print_err('invalid current_doc!');