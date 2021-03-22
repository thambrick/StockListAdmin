
import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import waitImg from './wait.gif';

//var userList;
var userId;
var email;
var admin="false";
var selectedUser;


window.refreshFunction = function(){
	alert("test123 userId=");
	alert(userId);
	this.UserList();
	
}

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
	//let userId2 = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
	//parent.iFrameWin = window;

	let params = window.location.search;
	userId = params.replace("?userid=", "");
	//userId = params.substring(0, params.search("&email="));
	//alert(userId);
	//this.state = setGetAllUserData("");
	this.state = {values: []};

	//window.location="https://www.stocklistnow.com/";
  }
  
    componentDidMount() {
    this.UserList();
	//wait('on');
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
            .catch(error => alert(JSON.parse(error).body));
        }
		

    setGetUserData(oneUserData){
			//alert("setGetUserData===");			
			
			oneUserData = JSON.parse(oneUserData);
			
			//alert(oneUserData.Items[0].userId);
			selectedUser=oneUserData.Items[0].userId;
			admin=oneUserData.Items[0].admin;
			//alert(admin);
			//alert(document.getElementById("admin").checked);
			//document.getElementById("admin").checked=true;
			//alert(document.getElementById("admin").checked);
			
		    if (admin==="true"){
			   admin="true";
			   //document.getElementById("admin").checked=true;
			   this.setState({ checked: true })
			} else {
			   admin="false";
			   //document.getElementById("admin").checked=false;
			   this.setState({ checked: false })
			}   
			//alert("setGetUserData===");
			//alert(admin);
			//document.getElementById("admin").checked=true;
			document.getElementById("email").value=oneUserData.Items[0].email;
			document.getElementById("displayName").value=oneUserData.Items[0].displayName;
			document.getElementById("city").value=oneUserData.Items[0].city;
			document.getElementById("userId").value=oneUserData.Items[0].userId;
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
			//alert("111");alert(raw);
            fetch("https://ohqt9x52g9.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
             .then(response => response.text())
			 .then(result => this.setStateNow(JSON.parse(result).body))
             //.then(result => this.setState(JSON.parse(result).body))
			 //.then(result => alert(JSON.parse(result).body))
            .catch(error => alert(JSON.parse(error).body));
    }

    setStateNow(userData){
		//alert("setStateNow:...")
        userData = userData.replace("Items", "values",1);
		//alert(userData)	
		//alert(userData.search("\"Count\":0,"))
		if (userData.search("\"Count\":0,")!==-1) {
			//alert("111444")		
		    wait('off');
		} else {	
		   //alert("setStateNow:.sss..")	
		   userData = JSON.parse(userData);
		   //alert(userData.values[0].userId)
		   //callGetAllUsersAPI(userData.values[0].userId);
		   this.CallGetUserAPI(userData.values[0].userId);
		   //alert("111333")
		   //alert(userData.values[0].userId)
    	   this.setState(userData);
		   //alert("111444")
		}  

    }
	
	deleteProfile = () => {
		//alert(selectedUser);
		//alert(userData.values[0].userId);
		wait('on');
		this.CallDeleteUserAPI(selectedUser);
	}

    updateProfile = () => {
		if ((!userId)||(userId==="")){ 
		   alert("you must login before editing user profiles"); 
		   return false;
		   }
		wait('on');
		try {
			//let userId = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/, "$1"); 
			let userId = document.getElementById("userId").value;
			//alert(userId);
			let email = document.getElementById("email").value;
			let city = document.getElementById("city").value;
			let displayName = document.getElementById("displayName").value;
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({"userId":userId,"email":email,"displayName":displayName,"city":city,"admin":admin});
			//alert("444");alert(raw);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
			fetch("https://u3yyrwv2r5.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
             .then(response => response.text())
			 //.then(result => alert(JSON.parse(result).body))
			 .then(result => {alert(JSON.parse(result).body);wait('off');})
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
	  
	//alert(admin);
    this.setState({ checked: event.target.checked })
	
  }
  
   handleChange = (e) => {
	selectedUser=e.target.value;
	this.setState({selectedValue: e.target.value})
	this.CallGetUserAPI(e.target.value); 
  }
 
  render() {
    let optionTemplate = this.state.values.map(v => (
      <option value={v.userId}>{v.displayName}</option>
    )); 
	
	const Checkbox = props => (
		<input type="checkbox" {...props} />
	)
			
    return (    
	            <section id="yourProfile" class="wrapper style2 spotlights">
                <div class="inner">    
				<div id="waitDiv2" align="center" style={{zIndex:10000}}>
					<img id='waitImg2' alt="Wait" src={waitImg} class='ajax-loader'  style={{zIndex:10000,position: 'absolute',left: 0,top: 0,right: 0,bottom: 0,margin: 'auto'}}/>
				</div>
				<center><h2><label id='profileTitle'>Administration</label></h2></center>
				<form id='profileForm' method='post' >					
				<table> 
				<tr>
				<td align='right'><label>Name</label></td>
				<td align='left' colspan='2' >
				<select value={this.state.value} onChange={this.handleChange}>
					{optionTemplate}
				</select>
                </td>
                </tr>
				<tr><td align='right'><label>City</label></td><td><input type='text' id='city' onchange={this.handleChange}/></td></tr>
                <tr><td align='right'><label>Email</label></td><td><input type='text' defaultValue={email} id='email' onchange={this.handleChange}/></td></tr>
			    <tr><td align='right'><label>Administrator</label></td><td>		
				<input type="checkbox" onChange={this.handleCheck} defaultChecked={this.state.checked}/>
				<label>
				<Checkbox id='admin'
					checked={this.state.checked}
					onChange={this.handleCheckboxChange}
				/>
				</label>

				<input type='hidden'  id='userId' />
			    <input type='hidden' id='displayName' />

				</td></tr>
				<tr><td colspan='2' align='center'>
				<input type='button' value="Submit" id='updateProfile' onClick={this.updateProfile}/> 
			    <input type='button' value="Delete User" id='updateProfile' onClick={this.deleteProfile}/></td></tr>
				</table>
                </form>
                </div>				
				</section> 
        );
  }
}

ReactDOM.render(<Container />, document.getElementById('root'));
