
import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import waitImg from './wait.gif';

var userId;
var email;
//var color;
//var userImage;

var admin="false";
var selectedUser;


function wait(onOff){
	       //alert(onOff);
		   if (onOff === 'on') { 
		     document.getElementById('waitDiv2').style.display = "block";
		     document.body.style.cursor='default';
		   } else  if (onOff === 'off') { 
		     document.getElementById('waitDiv2').style.display = "none";
		     document.body.style.cursor='default';
		   } 
       }


class Container extends React.Component {
  constructor(props) {
    super(props);

	//document.getElementById('StockListAdmin').src=
	//"https://www.stocklistsite.com?userid=" + userId + "&color="+color;
	//?userid=thambrick&color=red		  	  
	let params = window.location.search;
	//alert(params);
	
	userId = params.replace("?userid=", "");
	
	//alert(userId);
	
	userId = userId.substring(0,userId.search("&color="));
	
	//alert(userId);
	
	//color = "backgroundColor:'"+params.replace("?userid="+userId+"&color=", "")+"'";
	//alert(color);	 

	this.state = {values: []};
	    //window.location="https://www.stocklistnow.com/";
    }
  
    componentDidMount() {
		this.UserList();
    }

    CallDeleteUserAPI = (userId)=>{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({"userId":userId});
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
			//alert("222");alert(raw);
            fetch("https://dh3d04lkq3.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
             .then(response => response.text())
             .then(result => this.setDelUserData(JSON.parse(result).body))
            .catch(error => alert(JSON.parse(error).body));
        }
	
    setDelUserData(oneUserData){
        alert(oneUserData);
		this.UserList();
    }	   
  
    CallGetUserAPI = (userId)=>{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({"userId":userId});
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
			//alert("222");alert(raw);
            fetch("https://0pc218tpdc.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
             .then(response => response.text())
             .then(result => this.setGetUserData(JSON.parse(result).body))
            //.catch(error => alert(JSON.parse(error).body));
			.catch(error => alert(error));

        }
		

    setGetUserData(oneUserData){
			alert("setGetUserData===");
			alert(oneUserData);
			oneUserData = JSON.parse(oneUserData);
			selectedUser=oneUserData.Items[0].userId;
			admin=oneUserData.Items[0].admin;
		    if (admin==="true"){
			   admin="true";
			   this.setState({ checked: true })
			} else {
			   admin="false";
			   this.setState({ checked: false })
			}   
			document.getElementById("email").value=oneUserData.Items[0].email;
			document.getElementById("displayName").value=oneUserData.Items[0].displayName;
			document.getElementById("city").value=oneUserData.Items[0].city;
			document.getElementById("userId").innerHTML=oneUserData.Items[0].userId;
			document.getElementById("userImage").value=oneUserData.Items[0].userImage;
			document.getElementById("color").value=oneUserData.Items[0].color;

            //alert(document.getElementById("userId").innerHTML)
            //alert("11111");
			wait('off');
		}

    UserList() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({"userId":userId});
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
            fetch("https://ohqt9x52g9.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
             .then(response => response.text())
			 .then(result => this.setStateNow(JSON.parse(result).body))
            .catch(error => alert(JSON.parse(error).body));
    }



    setStateNow(userData){
		alert(userData)
        userData = userData.replace("Items", "values",1);
		if (userData.search("\"Count\":0,")!==-1) {		
		    wait('off');
		} else {		
		   userData = JSON.parse(userData);
		   this.CallGetUserAPI(userData.values[0].userId);
		   alert(userData.values[0].userId)
    	   this.setState(userData);
		} 
    }

	deleteProfile = () => {
		if (window.confirm('Comfirm delete user?')) {
			wait('on');
			this.CallDeleteUserAPI(selectedUser); 
		}
	}

    updateProfile = () => {
		if ((!userId)||(userId==="")){ 
		   alert("You must login before editing user profiles"); 
		   return false;
		   }
		wait('on');
		try {
			//let userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
			let userId = document.getElementById("userId").innerHTML;
			//alert(userId);
			let email = document.getElementById("email").value;
			let city = document.getElementById("city").value;
			let displayName = document.getElementById("displayName").value;
			
			let userImage = document.getElementById("userImage").value;
			let color = document.getElementById("color").value;
			
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            //var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin});
			//var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin,"userImage":userImage,"color":color });
            var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin,"userImage":userImage,"color":color });
           
			//alert("444");alert(raw);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
			fetch("https://u3yyrwv2r5.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
            .then(response => response.text())
             //.then(result => document.getElementById('getDataInputLabel').innerHTML=JSON.parse(result).body)
            .then(result => {alert(JSON.parse(result).body);wait('off')})
			//.then(result => alert(JSON.parse(result).body))
            .catch(error => alert(JSON.parse(error).body));
		} catch (error) {
			//console.error(error);
			alert(error);
		}
	  }


	handleCheckboxChange = event => {
		if (event.target.checked)
			admin="true";
		else 
			admin="false";  
		  
		this.setState({ checked: event.target.checked })
	  }
	  
	handleChange = (e) => {
		selectedUser=e.target.value;
		this.setState({selectedValue: e.target.value})
		this.CallGetUserAPI(e.target.value); 
		//class="wrapper style2 spotlights"
		//    <section id="yourProfile" style={{backgroundColor:'black'}} class="wrapper style2 spotlights">
	  }
	 
	 //[{"userId": "thambrick", "city": "Hhhhh", "displayName": "Trey13", "email": "Treyvhambrick", "userImage": "585BB9AB-7C1F-4A67-9C56-F29E7A870EAE.jpeg", "id": null, "friendee": null, "friender": null, "friendStatus": null}, {"userId": "thambrick10", "city": "111", "displayName": "TestUser1", "email": "trey.hambrick@cox.net", "userImage": "golf.png", "id": "thambrick10thambrick4", "friendee": "thambrick4", "friender": "thambrick10", "friendStatus": ""}, {"userId": "thambrick12", "city": "yacoon", "displayName": "Trey12", "email": "trey.hambrick@cox.net", "userImage": "", "id": "thambrick12thambrick4", "friendee": "thambrick4", "friender": "thambrick12", "friendStatus": ""}, {"userId": "thambrick2", "city": "dddd", "displayName": "rrrrr", "email": "trey.hambrick@gmail.com", "userImage": "", "id": "thambrick4thambrick2", "friendee": "thambrick2", "friender": "thambrick4", "friendStatus": "C"}, {"userId": "thambrick3", "city": "testcity", "displayName": "TreyAdmin", "email": "trey.hambrick@cox.net", "userImage": "8744BBFA-BD64-49B8-BC1D-4DB20E8DB88D.jpeg", "id": "thambrick3thambrick4", "friendee": "thambrick4", "friender": "thambrick3", "friendStatus": ""}, {"userId": "thambrick4", "city": "fairfax", "displayName": "Trey444", "email": "trey.hambrick@cox.net", "userImage": "", "id": null, "friendee": null, "friender": null, "friendStatus": null}, {"userId": "thambrick6", "city": "Fairfax", "displayName": "Trey000", "email": "trey.hambrick@cox.net", "userImage": "", "id": "thambrick4thambrick6", "friendee": "thambrick6", "friender": "thambrick4", "friendStatus": "C"}, {"userId": "thambrick7", "city": "5555", "displayName": "7777", "email": "4444", "userImage": "", "id": "thambrick7thambrick4", "friendee": "thambrick4", "friender": "thambrick7", "friendStatus": ""}, {"userId": "thambrick9", "city": "faircity", "displayName": "Trey999", "email": "trey.hambrick@gmail.com", "userImage": "", "id": null, "friendee": null, "friender": null, "friendStatus": null}]
	 //{"Items":[{"city":"Fairfax","displayName":"Trey666","userImage":"home.jpg","admin":"false","rstatus":" ","userId":"thambrick6","email":"trey.hambrick@cox.net"},{"city":"","displayName":"Trey123","userImage":"","admin":"false","rstatus":" ","userId":"thambrick","email":"trey.hambrick@gmail.com"},{"city":"fffff","displayName":"Trey444","userImage":"","admin":"false","rstatus":" ","userId":"thambrick5","email":"trey.hambrick@gmail.com"},{"city":"1111","displayName":"Admin","userImage":"home.jpg","admin":"true","rstatus":" ","userId":"thambrick4","email":"2222"},{"city":"Fairfax","displayName":"Trey999","userImage":"","admin":"false","rstatus":" ","userId":"thambrick9","email":"trey.hambrick@gmail.com"},{"city":"","displayName":"Trey333","userImage":"home.jpg","admin":"false","rstatus":" ","userId":"thambrick3","email":"trey.hambrick@cox.net"},{"city":"Fairfax ","displayName":"TreyAdmin","userImage":"33606022-6F56-403F-9D39-8FEEE0CA920B.jpeg","admin":"true","rstatus":" ","userId":"thambrick7","email":"trey.hambrick@cox.net"}],"Count":7,"ScannedCount":7}

	 
	render() {
		let optionTemplate = this.state.values.map(v => (
		   <option value={v.userId}>{v.displayName}</option>   
		)); 
	
	const Checkbox = props => (
		<input type="checkbox" {...props} />
	)
			
    return (    
	            <section id="yourAdmin" style={{backgroundColor:'black'}} class="wrapper style2 spotlights">
                <div class="inner">    
				<div id="waitDiv2" align="center" style={{zIndex:10000}}>
					<img id='waitImg2' alt="Wait" src={waitImg} class='ajax-loader'  style={{zIndex:10000,position: 'absolute',left: 0,top: 0,right: 0,bottom: 0,margin: 'auto'}}/>
				</div>
				<center><h2><label id='profileTitle'>Administration</label></h2>
				<form id='profileForm' method='post' >					
				<table> 
				<tr>
				<td align='right' style={{width:'33%'}}><label>Name</label></td>
				<td align='left' colspan='2' >
				<select style={{dropdownIndicator:'black',width:'215px',background:'white',color:'rgba(25, 25, 25, 5)'}} value={this.state.value} onChange={this.handleChange}>
					{optionTemplate}
				</select>
                </td>
                </tr>
				<tr><td align='right' style={{width:'33%'}}><label>City</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} id='city' onchange={this.handleChange}/></td></tr>
                
				<tr><td align='right' style={{width:'33%'}}><label>Color</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} id='color' onchange={this.handleChange}/></td></tr>
				<tr><td align='right' style={{width:'33%'}}><label>Image</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} id='userImage' onchange={this.handleChange}/></td></tr>
				<tr><td align='right' style={{width:'33%'}}><label>Email</label></td><td><input style={{color:'rgba(25, 25, 25, 5)',width:'212px'}} defaultValue={email} id='email' onchange={this.handleChange}/></td></tr>
			    <tr><td align='right' style={{width:'33%',}}><label>ID</label></td><td><label id='userId'></label></td></tr>
			    
				<tr><td align='right'style={{width:'33%',textAlignVertical:'top',color:'rgba(25, 25, 25, 5)'}}><label>Admin</label></td><td>		
				<input type="checkbox" style={{textAlignVertical:'bottom'}}onChange={this.handleCheck} defaultChecked={this.state.checked}/>
				<label>
				<Checkbox id='admin'
					checked={this.state.checked}
					onChange={this.handleCheckboxChange}
				/>
				</label>
			    <input type='hidden' id='displayName' />

				</td></tr>
				<tr><td colspan='2' align='center'>
				<input type='button' value="Update" id='updateProfile' onClick={this.updateProfile}/> 
			    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<input type='button' value="Delete User" id='updateProfile' onClick={this.deleteProfile}/>


				</td></tr>
				</table>
				
                </form>
				</center>
                </div>				
				</section> 
        );
  }
}

ReactDOM.render(<Container />, document.getElementById('root'));
