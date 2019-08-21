/*
UniMath: support of MathML on most of browsers.
(c) Ivan Vanyushkin, 2004
http://vanav.iatp.org.ua/go/unimath
Version: 0.0.2.
*/

var mSplitMath=false;
var msymbols=[];
msymbols=msymbols.concat([	{output:"+",xml:"&plus;"},
							{output:"&nabla;",xml:"&Del;"},
							{output:"=",xml:"&equals;"},
							{output:"&#x000AF;",xml:"&OverBar;"},
							{output:"&#x000B1;",xml:"&PlusMinus;"},
							{output:"&#x00B7;",xml:"&sdot;",dec:"8901",hex:"22C5"},
							{output:"<b>C</b>",xml:"&Copf;",dec:"8450",hex:"2202"},
							{output:"<b>R</b>",xml:"&Ropf;",dec:"8477",hex:"211D"},
							{output:"&#x2227;",xml:"&Wedge;",dec:"8896",hex:"22C0"},
							{output:"&#x2228;",xml:"&Vee;",dec:"8897",hex:"22C1"},
							{output:"&#x2229;",xml:"&Intersection;",dec:"8898",hex:"22C2"},
							{output:"&#x222A;",xml:"&Union;",dec:"8899",hex:"22C3"},
							{output:"*",xml:"&Star;",dec:"8902",hex:"22C6"},
							{output:"~",xml:"&UnderBar;"},
							{output:"",xml:"&InvisibleTimes;"},
							{output:"",xml:"&it;"},
							{output:"",xml:"&ApplyFunction;"},
							{output:"",xml:"&af;"},
							{output:"",xml:"&InvisibleComma;"},
							{output:"",xml:"&ic;"},
							{output:"D",xml:"&CapitalDifferentialD;"},
							{output:"d",xml:"&DifferentialD;"},
							{output:"e",xml:"&ExponentialE;"},
							{output:"i",xml:"&ImaginaryI;"},
							{output:"&hellip;",xml:"&ctdot;",dec:"8943",hex:"22EF"},
							{tag:"mo",output:"&minus;",xml:"-"}]);
veryverythinmathspace=0.0555556;
verythinmathspace=0.111111;
thinmathspace=0.166667;
mediummathspace=0.222222;
thickmathspace=0.277778;
verythickmathspace=0.333333;
veryverythickmathspace=0.388889;
OperatorDictionary=[	{xml:"(",ls:0,rs:0},
						{xml:")",ls:0,rs:0},
						{xml:"[",ls:0,rs:0},
						{xml:"]",ls:0,rs:0},
						{xml:"{",ls:0,rs:0},
						{xml:"}",ls:0,rs:0},
						{xml:"&InvisibleComma;",ls:0,rs:0},
						{xml:",",ls:0,rs:verythickmathspace},
						{xml:"&ApplyFunction;",ls:verythinmathspace,rs:verythinmathspace},
						{xml:"&InvisibleTimes;",ls:0,rs:0},
						{xml:"-",ls:mediummathspace,rs:mediummathspace},
						{xml:"+",ls:mediummathspace,rs:mediummathspace},
						{xml:"&int;",dec:8747,lg:1,ls:0,rs:0},
						{xml:"!",ls:verythinmathspace,rs:0}];

var Moz=!!window.pkcs11;
var Ie=!!document.defaultCharset;
var Op=!!window.opera;
var Nw=typeof(process)!=='undefined';

function GetFirstChild(xmlNode) {
	for(var j=0;j<xmlNode.childNodes.length;j++){
		var node=xmlNode.childNodes[j];
		if(node.nodeType!=1) continue;
		return node
	}
	return null
}

function GetSecondChild(xmlNode) {
	var c=0;
	for(var j=0;j<xmlNode.childNodes.length;j++){
		var node=xmlNode.childNodes[j];
		if(node.nodeType!=1) continue;
		c++;
		if(c==2)return node
	}
	return null
}

function GetThirdChild(xmlNode) {
	var c=0;
	for(var j=0;j<xmlNode.childNodes.length;j++){
		var node=xmlNode.childNodes[j];
		if(node.nodeType!=1) continue;
		c++;
		if(c==3) return node
	}
	return null
}

function XmlStringLength(xmlStr) {
	if(xmlStr){
		xmlStr=xmlStr.replace(/(&[#0-9A-Za-z]+;)/g,"#");
		return xmlStr.length
	} else
		return 0
}

function SetTextValue(xmlNode,htmlNode,elemName){
	if(!xmlNode) return;
	var text=xmlNode.nodeValue;
	text=text.replace(/^[ \n\t\r]*([\s\S]*[^ \n\t\r])[ \n\t\r]*$/,"$1");
	text=text.replace(/%([0-9A-Za-z]+);/g,"&$1;");
	if(elemName=="mo"){
		var Found;
		for(var i=0;i<OperatorDictionary.length;i++){
			var d=OperatorDictionary[i];
			if(text==d.xml||text.charCodeAt(0)==d.dec){
				htmlNode.style.marginLeft=d.ls+'em';
				htmlNode.style.marginRight=d.rs+'em';
				if(d.lg) htmlNode.style.fontSize='160%';
				Found=true;
				break
			}
		}
		if(!Found){
			htmlNode.style.marginLeft=thickmathspace+'em';
			htmlNode.style.marginRight=thickmathspace+'em'
		}
	}
	for(var i=0;i<msymbols.length;i++) {
		var r=msymbols[i];
		if(r.tag&&xmlNode.nodeName==r.tag){
			text=text.replace(new RegExp(r.xml),r.output)
		} else {
			text=text.replace(new RegExp(r.xml+"|&#"+r.dec+";|&#x"+r.hex+";","g"),r.output)
		}
		for(var j=0;j<text.length;j++){
			if(text.charCodeAt(j)==r.dec) text=text.substr(0,j)+r.output+text.substr(j+1)
		}
	}
	return htmlNode.innerHTML=text
}

var Debug=false;

function NewTd(htmlNode,classInfo){
	var tdMain=document.createElement('td');
	if(classInfo) tdMain.className=classInfo;
	if(classInfo=="msubsup_main") tdMain.rowSpan=2;
	htmlNode.appendChild(tdMain);
	return tdMain
}

function GetTd(htmlNode,tdElem,classInfo){
	if(!tdElem){
		tdElem=NewTd(htmlNode,classInfo)
	}
	return tdElem
}

function NewTable(htmlNode,classInfo){
	var table=document.createElement('table');
	table.setAttribute('cellPadding',0);
	table.setAttribute('cellSpacing',0);
	table.className="math_table";
	if(Debug) table.border=1;
	if(classInfo){
		table.className=table.className+" "+classInfo
	}
	var tbody=document.createElement('tbody');
	table.appendChild(tbody);
	htmlNode.appendChild(table);
	return tbody
}

function ParseElem(xmlNode,htmlNode,tdElem,classInfoTd,classInfoTable){
	switch(xmlNode.nodeName){
		case "mi":
			tdElem=GetTd(htmlNode,tdElem,classInfoTd);
			var container=document.createElement('span');
			if(XmlStringLength(SetTextValue(xmlNode.firstChild,container))==1) container.style.fontStyle='italic';
			tdElem.appendChild(container);
			break;
		case "mn":
			tdElem=GetTd(htmlNode,tdElem,classInfoTd);
			var container=document.createElement('span');
			container.className="mn";
			SetTextValue(xmlNode.firstChild,container);
			tdElem.appendChild(container);
			break;
		case "mo":
			tdElem=null;
			td=GetTd(htmlNode,null,classInfoTd);
			var container=document.createElement('span');
			container.className="mo";
			SetTextValue(xmlNode.firstChild,container,"mo");
			td.appendChild(container);
			break;
		case "mrow":
			if(xmlNode.childNodes.length<=1) {
				tdElem=ParseNode(xmlNode,htmlNode,tdElem,classInfoTd,classInfoTable);
			} else {
				tdElem=null;
				var tdMain=NewTd(htmlNode,classInfoTd);
				var tbody=NewTable(tdMain,classInfoTable);
				var tr=document.createElement('tr');
				ParseNode(xmlNode,tr,null,"");
				tbody.appendChild(tr)
			}
			break;
		case "mfrac":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain,"mfrac");
			var tr=document.createElement('tr');
			ParseElem(GetFirstChild(xmlNode),tr,null,"mfrac_top");
			tbody.appendChild(tr);
			var tr=document.createElement('tr');
			ParseElem(GetSecondChild(xmlNode),tr,null,"mfrac_bottom");
			tbody.appendChild(tr);
			break;
		case "msup":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain,classInfoTable);
			var tr=document.createElement('tr');
			ParseElem(GetFirstChild(xmlNode),tr,null,"msup_left");
			ParseElem(GetSecondChild(xmlNode),tr,null,"msup_right");
			tbody.appendChild(tr);
			break;
		case "msub":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain,classInfoTable);
			var tr=document.createElement('tr');
			ParseElem(GetFirstChild(xmlNode),tr,null,"msub_left");
			ParseElem(GetSecondChild(xmlNode),tr,null,"msub_right");
			tbody.appendChild(tr);
			break;
		case "msubsup":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain);
			var tr=document.createElement('tr');
			ParseElem(GetFirstChild(xmlNode),tr,null,"msubsup_main");
			ParseElem(GetThirdChild(xmlNode),tr,null,"msubsup_sup");
			tbody.appendChild(tr);
			var tr=document.createElement('tr');
			ParseElem(GetSecondChild(xmlNode),tr,null,"msubsup_sub");
			tbody.appendChild(tr);
			break;
		case "mfenced":
			tdElem=null;
			var tdMain=document.createElement('td');
			if(classInfoTd) tdMain.className=classInfoTd;
			var td=document.createElement('td');
			var at=xmlNode.getAttribute("open");
			if(!at) at="(";
			td.innerHTML=at;
			htmlNode.appendChild(td);
			tdElem=ParseNode(xmlNode,tdMain,tdMain);
			htmlNode.appendChild(tdMain);
			var td=document.createElement('td');
			var at=xmlNode.getAttribute("close");
			if(!at) at=")";
			td.innerHTML=at;
			htmlNode.appendChild(td);
			break;
		case "msqrt":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain,'mroot');
			var tr=document.createElement('tr');
			var td=document.createElement('td');
			td.className="mroot_char";
			td.innerHTML="&radic;";
			tr.appendChild(td);
			ParseNode(xmlNode,tr,null,"mroot_body");
			tbody.appendChild(tr);
			break;
		case "mroot":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain,'mroot');
			var tr=document.createElement('tr');
			var td=document.createElement('td');
			td.className="mroot_char";
			td.innerHTML="&radic;";
			tr.appendChild(td);
			ParseElem(GetFirstChild(xmlNode),tr,null,"mroot_body");
			tbody.appendChild(tr);
			break;
		case "munderover":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain);
			var tr=document.createElement('tr');
			ParseElem(GetThirdChild(xmlNode),tr,null,"munderover_over");
			tbody.appendChild(tr);
			var tr=document.createElement('tr');
			ParseElem(GetFirstChild(xmlNode),tr,null,"munderover_middle");
			tbody.appendChild(tr);
			var tr=document.createElement('tr');
			ParseElem(GetSecondChild(xmlNode),tr,null,"munderover_under");
			tbody.appendChild(tr);
			break;
		case "munder":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain);
			var tr=document.createElement('tr');
			var td=document.createElement('td');
			td.className="munder_under";
			td.innerHTML="&nbsp;";
			tr.appendChild(td);
			tbody.appendChild(tr);
			var tr=document.createElement('tr');
			ParseElem(GetFirstChild(xmlNode),tr,null,"munder_middle");
			tbody.appendChild(tr);
			var tr=document.createElement('tr');
			ParseElem(GetSecondChild(xmlNode),tr,null,"munder_under");
			tbody.appendChild(tr);
			break;
		case "mover":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain);
			var tr=document.createElement('tr');
			ParseElem(GetSecondChild(xmlNode),tr,null,"mover_over");
			tbody.appendChild(tr);
			var tr=document.createElement('tr');
			ParseElem(GetFirstChild(xmlNode),tr,null,"mover_middle");
			tbody.appendChild(tr);var tr=document.createElement('tr');
			var td=document.createElement('td');
			td.className="mover_over";
			td.innerHTML="&nbsp;";
			tr.appendChild(td);
			tbody.appendChild(tr);
			break;
		case "mtable":
			tdElem=null;
			var tdMain=NewTd(htmlNode,classInfoTd);
			var tbody=NewTable(tdMain);ParseNode(xmlNode,tbody,null,"");
			break;
		case "mtr":
			var tr=document.createElement('tr');
			ParseNode(xmlNode,tr,null,"");
			htmlNode.appendChild(tr);
			break;
		case "mtd":
			var td=document.createElement('td');
			td.style.padding="0 .4em";
			var tbody=NewTable(td);
			var tr=document.createElement('tr');
			ParseNode(xmlNode,tr,null);
			tbody.appendChild(tr);
			htmlNode.appendChild(td);
			break;
		default:
			tdElem=ParseNode(xmlNode,htmlNode,tdElem,classInfoTd,classInfoTable);
			break
	}
	return tdElem
}

function ParseNode(xmlNode,htmlNode,tdElem,classInfoTd,classInfoTable){
	if(!xmlNode) return;
	for(var j=0;j<xmlNode.childNodes.length;j++){
		var node=xmlNode.childNodes[j];
		if(node.nodeType==3){
			if(!(/^[\s]+$/.test(node.nodeValue))){
				var container=document.createElement('span');
				SetTextValue(node,container);
				tdElem=GetTd(htmlNode,tdElem,classInfoTd);
				tdElem.appendChild(container)
			}
		}
		if(node.nodeType!=1) continue;
		tdElem=ParseElem(node,htmlNode,tdElem,classInfoTd,classInfoTable)
	}
	return tdElem
}

function AdjustMath(htmlNode){
	AdjustNode(htmlNode);
	if(mSplitMath){
		AdjustNodeSplit(htmlNode,0);
		if(Op){
			var tables=htmlNode.parentNode.parentNode.parentNode.childNodes;
			for(var i=0;i<tables.length;i++) 
				tables[i].style.paddingTop=(tables[i].parentNode.offsetHeight-tables[i].offsetHeight)/Em/2+'em'
		}
	}
	if(Moz){
		var tables=htmlNode.parentNode.parentNode.parentNode.childNodes;
		for(var i=0;i<tables.length;i++)
			tables[i].style.paddingTop=tables[i].firstChild.offsetHeight/Em-0.9+'em'
	}
}

function AdjustNode(htmlNode){
	for(var j=0;j<htmlNode.childNodes.length;j++){
		var node=htmlNode.childNodes[j];
		if(node.nodeType==3){}
		if(node.nodeType!=1) continue;
		if(node.firstChild&&(val=node.firstChild.nodeValue)){
			if(val=='('||val==')'||val=='['||val==']'||val=='{'||val=='}'||val=='|'){
				node.style.fontSize=node.parentNode.offsetHeight/Em*0.82+"em"
			}
			if(val.charCodeAt(0)==0x221A){
				node.style.overflow='hidden';
				node.style.lineHeight='0.95em';
				node.style.fontSize=node.parentNode.offsetHeight/Em*0.85+"em"
			}
		}
		AdjustNode(node)
	}
}

function AdjustNodeSplit(htmlNode,level){
	var newTable,newTr;
	node=htmlNode.firstChild;
	while(node){
		if(node.nodeType!=1) continue;
		var nodeNext=node.nextSibling;
		if(node.nodeName=="TD"&&level==0){
			newTable=node.parentNode.parentNode.parentNode.cloneNode(false);
			var tbody=document.createElement('tbody');
			newTable.appendChild(tbody);
			var newTr=document.createElement('tr');
			tbody.appendChild(newTr);
			node.parentNode.parentNode.parentNode.parentNode.appendChild(newTable);
			newTr.appendChild(node)
		}
		node=nodeNext
	}
}

var HiddenBox,HiddenBox2;
var Em;

function Init(){
	if(Em) return; // дабы не плодить дивы
	HiddenBox=document.createElement('div');
	HiddenBox.style.visibility='hidden';
	HiddenBox.style.position='absolute';
	HiddenBox.style.left=HiddenBox.style.top='0';
	HiddenBox2=document.createElement('div');
	HiddenBox2.style.position='absolute';
	HiddenBox2.style.left=HiddenBox2.style.top='0';
	HiddenBox.appendChild(HiddenBox2);
	document.getElementsByTagName('body')[0].appendChild(HiddenBox);
	HiddenBox2.className='math';
	HiddenBox2.innerHTML='&nbsp;';
	HiddenBox2.style.width='5em';
	Em=HiddenBox2.offsetWidth/5;
	HiddenBox2.innerHTML=HiddenBox2.className='';
	HiddenBox2.style.width='auto'
}

function mBuildMath(xmlMath){
	var Root=document.createElement('div');
	Root.style.display='inline';
	var newEl=document.createElement('table');
	newEl.setAttribute('cellPadding',0);
	newEl.setAttribute('cellSpacing',0);
	if(Debug) newEl.setAttribute('border',1);
	newEl.className="math_table math";
//	if(!(Op||Nw))
//		newEl.style.display="inline";
//	else 
//		newEl.style.display="inline-table";
	newEl.style.display="inline-table";
//
	newEl.style.verticalAlign="middle";
	Root.appendChild(newEl);
	var tbody=document.createElement('tbody');
	newEl.appendChild(tbody);
	var tr=document.createElement('tr');
	tbody.appendChild(tr);
	ParseNode(xmlMath,tr,null);
	HiddenBox.appendChild(Root);
	AdjustMath(tr);
	return Root
}

function ReplaceMathByHtml(xmlDoc){
	if(!xmlDoc) xmlDoc=document.getElementsByTagName("body")[0];
	Init();
	var x=xmlDoc.getElementsByTagName('math');
	while(x.length){
		x[0].parentNode.replaceChild(mBuildMath(x[0]),x[0]);
		x=xmlDoc.getElementsByTagName('math')
	}
}

function convertMath(node){
	if(node.nodeType==1){
		var newnode=document.createElementNS("http://www.w3.org/1998/Math/MathML",node.nodeName.toLowerCase());
		for(var i=0;i<node.attributes.length;i++)
			newnode.setAttribute(node.attributes[i].nodeName,node.attributes[i].nodeValue);
		for(var i=0;i<node.childNodes.length;i++){
			var st=node.childNodes[i].nodeValue;
			if(st==null||st.slice(0,1)!=" "&&st.slice(0,1)!="\n")
			newnode.appendChild(convertMath(node.childNodes[i]))
		}
		return newnode
	} else 
		return node
}

function convert(htmlRoot){
	if(Op) return;
	if(!htmlRoot) htmlRoot=document;
	mmlnode=htmlRoot.getElementsByTagName("math");
	var st,str,node,newnode;
	for(var i=0;i<mmlnode.length;i++) { // ?
		if(document.createElementNS!=null){
			mmlnode[i].parentNode.replaceChild(convertMath(mmlnode[i]),mmlnode[i])
		} else {
			str="";
			node=mmlnode[i];
			while(node&&node.nodeName!="/MATH"){
				st=node.nodeName.toLowerCase();
				if(st=="#text")
					str+=node.nodeValue;
				else {
					str+=(st.slice(0,1)=="/"?"</m:"+st.slice(1):"<m:"+st);
					if(st.slice(0,1)!="/")
						for(var j=0;j<node.attributes.length;j++)
							if(node.attributes[j].nodeValue!="italic"&&node.attributes[j].nodeValue!=""&&node.attributes[j].nodeValue!="inherit"&&node.attributes[j].nodeValue!=undefined)
								str+=" "+node.attributes[j].nodeName+"="+"\""+node.attributes[j].nodeValue+"\"";
					str+=">"
				}
				var nodeold=node;
				node=node.nextSibling;
				nodeold.parentNode.removeChild(nodeold)
			}
			if(!node) return;
			str+="</m:math>";
			newnode=document.createElement("span");
			node.parentNode.replaceChild(newnode,node);
			newnode.innerHTML=str
		}
	} // ?
}

var MWJ_ldD=[];

function importXML(oURL,oFunct,oFunctParams){
	if(!navigator.__ice_version&&document.implementation&&document.implementation.createDocument){
		var xmlDocObj=document.implementation.createDocument('','',null);
		if(xmlDocObj.load){
			MWJ_ldD[MWJ_ldD.length]=oFunctParams;
			xmlDocObj.onload=new Function('CheckMozFileLoad(this,"'+oFunct+'",'+(MWJ_ldD.length-1)+');');
			xmlDocObj.load(oURL);
			return true
		}
	}
	if(!navigator.__ice_version&&window.ActiveXObject){
		try{
			Obj=new ActiveXObject('Microsoft.XMLDOM');
			MWJ_ldD[MWJ_ldD.length]=oFunctParams;
			Obj.onreadystatechange=new Function('CheckIEFileLoad(Obj,"'+oFunct+'",'+(MWJ_ldD.length-1)+');');
			Obj.load(oURL);
			return true
		}
		catch(e){}
	}
	if(document.createElement&&document.childNodes){
		var ifr=document.createElement('DIV');
		ifr.style.visibility='hidden';
		ifr.style.position='absolute';
		ifr.style.top=ifr.style.left='0px';
		MWJ_ldD[MWJ_ldD.length]=oFunctParams;
		MWJ_ldD[MWJ_ldD.length]=oFunct+'(window.frames.MWJ_XML_loader_'+MWJ_ldD.length+'.window.document,'+(MWJ_ldD.length-1)+');';
		if(!window.MWJ_XML_timer) window.MWJ_XML_timer=setInterval('MWJ_checkXMLLoad();',100);
		ifr.innerHTML='<iframe src="'+oURL+'" name="MWJ_XML_loader_'+(MWJ_ldD.length-1)+'" height="0" width="0"><\/iframe>';
		document.body.appendChild(ifr);
		return true
	}
	return false
}

function MWJ_checkXMLLoad(){
	for(var x=0;x<MWJ_ldD.length;x++) {
		if(MWJ_ldD[x]&&window.frames['MWJ_XML_loader_'+x]){
			eval(MWJ_ldD[x]);
			MWJ_ldD[x]=false
		}
	}
}

function CheckMozFileLoad(xmlDoc,oFunct,oFunctParams){
	var roottag=xmlDoc.documentElement;
	if((roottag.tagName=="parserError")||(roottag.namespaceURI=="http://www.mozilla.org/newlayout/xml/parsererror.xml")){
		alert(roottag.childNodes[0].nodeValue+"\n"+roottag.childNodes[1].childNodes[0].nodeValue)
	}
	eval(oFunct+'(xmlDoc,oFunctParams);')
}

function CheckIEFileLoad(xmlDoc,oFunct,oFunctParams){
	if(xmlDoc.readyState==4){
		if(Obj.parseError.errorCode!=0) alert("You have error:\n"+Obj.parseError.reason);
		eval(oFunct+'(xmlDoc,oFunctParams);')
	}
}

function addMath(xmlDoc,ind){
	if(xmlDoc.documentElement&&xmlDoc.documentElement.tagName&&xmlDoc.documentElement.tagName.toUpperCase()=='HTML'){
		setTimeout('alert(\'For no apparent reason, your browser has turned the clean XML into HTML based garbage.\\nScript aborted.\');',50);
		return
	}
	var htmlRoot=MWJ_ldD[ind];
	var mathArr=xmlDoc.getElementsByTagName('math');
	Init();
	mParseNode(mathArr,htmlRoot)
}

function mParseNode(mathArr,node){
	var len=node.childNodes.length;
	for(var i=0;i<len;i++){
		var ni=node.childNodes[i];
		if((attr=ni.className)&&(attr=="math")){
			var val="math_"+ni.innerHTML.replace(/^([^\d]*)(\d+)([\s\S]*)$/,"$2");
			var x;
			for(var j=0;j<mathArr.length;j++)
				if(mathArr[j].getAttribute('id')==val){
					x=mathArr[j];
					break
				}
			if(x)
				ni.parentNode.replaceChild(mBuildMath(x),ni)}
			else
				mParseNode(mathArr,ni)
	}
}

function RemoveScript(node){
	if(node.nodeName=='SCRIPT')
		node.parentNode.removeChild(node);
	else
		for(var i=node.childNodes.length-1;i>=0;i--)
			RemoveScript(node.childNodes[i])
}

///////////////////////////////////////////////////////////////////////
// дальше идут пользовательские функции

function mLoadMathFromFile(File,htmlRoot){
	if(!htmlRoot) htmlRoot=document.getElementsByTagName("body")[0];
	var canItWork=importXML(File,'addMath',htmlRoot);
	return canItWork
}

// видимо эту функцию вызывать для узлов
function mTextToHtml(htmlRoot){
	if(!htmlRoot)
		var htmlRoot=document.getElementsByTagName("body")[0];
	var copy=htmlRoot.cloneNode(true);
	RemoveScript(copy);
	AMinitSymbols();
	AMprocessNode(copy,false);
	ReplaceMathByHtml(copy);
	while(htmlRoot.childNodes.length)
		htmlRoot.removeChild(htmlRoot.firstChild);
	while(copy.childNodes.length)
		htmlRoot.appendChild(copy.firstChild)
}

function mMathTextToHtml(htmlRoot){
	if(!htmlRoot)
		var htmlRoot=document.getElementsByTagName("body")[0];
	var copy=htmlRoot.cloneNode(true);
	convert(copy);
	RemoveScript(copy);
	AMinitSymbols();
	AMprocessNode(copy,false);
	ReplaceMathByHtml(copy);
	while(htmlRoot.childNodes.length)
		htmlRoot.removeChild(htmlRoot.firstChild);
	while(copy.childNodes.length)
		htmlRoot.appendChild(copy.firstChild)
}

function mMathToHtml(htmlRoot){
	if(!htmlRoot)
		var htmlRoot=document.getElementsByTagName("body")[0];
	var copy=htmlRoot.cloneNode(true);
	convert(copy);
	RemoveScript(copy);
	ReplaceMathByHtml(copy);
	while(htmlRoot.childNodes.length)
		htmlRoot.removeChild(htmlRoot.firstChild);
	while(copy.childNodes.length)
		htmlRoot.appendChild(copy.firstChild)
}

function isMathMLavailableMy(){
	if(navigator.appName.slice(0,8)=="Netscape")
		if(navigator.appVersion.slice(0,1)>="5")
			return true;
		else 
			return false;
	else 
		if(navigator.appName.slice(0,9)=="Microsoft")
			try{
				var ActiveX=new ActiveXObject("MathPlayer.Factory.1");
				return true
			}catch(e){
				return false
			}
		else 
			return false
}
