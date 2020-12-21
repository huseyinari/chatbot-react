import React, { Component } from 'react';
import './Homepage.css';
import { animateScroll } from "react-scroll";

import userLogo from '../icons/user.png';
import chatbotLogo from '../icons/chatbot.png';

import {IoSend} from 'react-icons/io5';

class Homepage extends Component {

    state = {
        message:'',
        userMessages:[],
        chatbotMessages:[],
        responseKeys:[],
        responseValues:[],
    }
    componentDidUpdate () {
        this.scrollToBottom()
    }
    componentDidMount(){
        this.getResponses();
    }
    getCurrency = (message) => {
        const {userMessages,chatbotMessages} = this.state;

        const rates = {
            tl : 'TRY',
            dolar : 'USD',
            euro : 'EUR'
        }
        const currentRate = rates[message.split(' ')[1].toLowerCase()];
        const currentAmount = Number(message.split(' ')[0]);
        const targetRate = rates[message.split(' ')[3].toLowerCase()];

        const url = 'https://v6.exchangerate-api.com/v6/1c40386ec7c717e1673c125d/latest/' + currentRate;
        
        fetch(url)
        .then(response => response.json())
        .then(responseData => {
            const targetAmount = Number(responseData.conversion_rates[targetRate]) * currentAmount;
            this.setState({ 
                userMessages:[...userMessages,message],
                chatbotMessages:[...chatbotMessages, currentAmount.toString() +' '+ message.split(' ')[1].toUpperCase() + ' = ' + targetAmount.toString().split('.')[0] + ',' + targetAmount.toString().split('.')[1].slice(0,3) +' '+ message.split(' ')[3].toUpperCase()],
                message:''
            })
        })
        .catch(() => this.setState({userMessages:[...userMessages,message],chatbotMessages:[...chatbotMessages,'Üzgünüm şuan sonuçları bulamadım.Lütfen daha sonra tekrar dene.'],message:''}));
    }
    getCoronaVirusData = (message) => {
        const cities = {
            türkiye : 'Turkey',
            turkiye : 'Turkey',
            fransa : 'France',
            amerika : 'USA',
            ingiltere : 'UK',
            rusya : 'Russia',
            almanya : 'Germany',
            azerbaycan : 'Azerbaijan'
        }
        let city = message.split(' ')[0].toLowerCase();
        const {userMessages,chatbotMessages} = this.state;
        const url = 'https://covid-193.p.rapidapi.com/statistics?country=' + cities[city];

        fetch(url,{
            method:'GET',
            headers:{
                "x-rapidapi-key": "ab922d8336msh3062df887a52c9cp1b781ajsn626cad196a1b",
	            "x-rapidapi-host": "covid-193.p.rapidapi.com",
	            "useQueryString": true
            }
        })
        .then(response => response.json())
        .then(responseData => {
            const res = responseData.response[0];
            const answer = 'Tarih : ' + res.day + '  Yeni Vaka : ' + res.cases.new + '  Yeni Ölüm : ' + res.deaths.new + '  Toplam Vaka : ' + res.cases.total + '  Toplam Ölüm : ' + res.deaths.total
                            + '  Aktif Vaka : ' + res.cases.active + '  İyileşen Hasta : ' + res.cases.recovered + '  Kritik Vaka : ' + res.cases.critical;
            this.setState({
                userMessages:[...userMessages,message],
                chatbotMessages:[...chatbotMessages,answer],
                message:''
            });
        })
        .catch(() => this.setState({userMessages:[...userMessages,message],chatbotMessages:[...chatbotMessages,'Üzgünüm şuan sonuçları bulamadım.Lütfen daha sonra tekrar dene.'],message:''}))
            
    }
    getResponses = () => {
        const url = 'responses.json';
        fetch(url,{
            method:'GET',
            headers:{
                'Content-type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(responseData => this.setState({responseKeys:Object.keys(responseData),responseValues:Object.values(responseData)}))
    }
    scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId: "messageList"
        });
    }
    messageChanged = (event) => {
        const message = event.target.value;
        this.setState({message});
    }
    getWeather = (message) => {
        const city = message.split(' ')[0];
        const apiURL = 'http://api.weatherapi.com/v1/current.json?key=4776584238ae41d892b224833200712&q=' + city;
        const {userMessages,chatbotMessages} = this.state;

        fetch(apiURL,{
            method:'GET',
            headers:{
                "Transfer-Encoding": "chunked",
                "Connection": "keep-alive",
                "Vary": "Accept-Encoding",
                "CDN-PullZone": "93447",
                "CDN-Uid": "8fa3a04a-75d9-4707-8056-b7b33c8ac7fe",
                "CDN-RequestCountryCode": "FI",
                "CDN-EdgeStorageId": "615",
                "Request-Context": "appId=cid-v1:89996683-9a04-40b3-8e46-77754119dcf5",
                "CDN-CachedAt": "2020-12-07 23:49:43",
                "CDN-RequestId": "9b6ada15e687d2eacf6385b9ea6f4b9e",
                "CDN-Cache": "MISS",
                "Cache-Control": "public, max-age=180",
                "Content-Type": "application/json",
                "Date": "Mon, 07 Dec 2020 22:49:43 GMT",
                "Server": "BunnyCDN-FI1-615"
            }
        })
        .then(response => response.json())
        .then(responseData => {
            this.setState({ 
                userMessages:[...userMessages,message],
                chatbotMessages:[...chatbotMessages,'Hava Sıcaklığı : ' + responseData.current.temp_c + ' °C      Hava Durumu : ' + responseData.current.condition.text],
                message:''
            })
        })
        .catch(() => this.setState({userMessages:[...userMessages,message],chatbotMessages:[...chatbotMessages,'Üzgünüm şuan sonuçları bulamadım.Lütfen daha sonra tekrar dene.'],message:''}))
    }
    sendMessage = () => {
        const {userMessages,chatbotMessages,message,responseKeys,responseValues} = this.state;

        if(message !== ''){
            let arananIndex=null;
            
            responseKeys.forEach( (key,index) => {
                if(message.toLowerCase().includes(key)){
                    arananIndex = index;
                }
            })
            if(arananIndex !== null){
                if(arananIndex === 0)
                    this.setState({userMessages:[...userMessages,message],chatbotMessages:[...chatbotMessages,responseValues[arananIndex][Math.floor(Math.random() * 7)]],message:''});
                else if(arananIndex === 1)
                    this.getWeather(message);
                else if(arananIndex === 2)
                    this.getCoronaVirusData(message);
                else if(arananIndex === 3){
                    const yemek = message.split(' ')[0];
                    this.setState({userMessages:[...userMessages,message],chatbotMessages:[...chatbotMessages,responseValues[arananIndex][yemek]],message:''});
                }
                else if(arananIndex === responseKeys.length-1)
                    this.getCurrency(message);
                else
                    this.setState({userMessages:[...userMessages,message],chatbotMessages:[...chatbotMessages,responseValues[arananIndex]],message:''});
            }
            else
                this.setState({userMessages:[...userMessages,message],chatbotMessages:[...chatbotMessages,'Üzgünüm anlayamadım !'],message:''});
        }
    }
    renderMessages = () => {
        const {userMessages,chatbotMessages} = this.state;
        let messagesJSX = [];
        for(let i=0; i<userMessages.length; i++){
            messagesJSX.push((
                <div>
                    <li className="message left appeared">
                        <div className="avatar">
                            <img src={userLogo} alt="user" width="75"></img>
                        </div>
                        <div className="text_wrapper">
                            <div className="text">{userMessages[i]}</div>
                        </div>
                    </li>
                    <li className="message right appeared">
                        <div className="avatar">
                            <img src={chatbotLogo} alt="user" width="65" height="70"></img>
                        </div>
                        <div className="text_wrapper">
                            <div className="text">{chatbotMessages[i]}</div>
                        </div>
                    </li>
                </div>
            ))
        }
        return messagesJSX;
    }
    render() {
        return (
            <div>
                <div className="chat_window">
                    <div className="top_menu">
                        <div className="buttons">
                            <div className="button close"></div>
                            <div className="button minimize"></div>
                            <div className="button maximize"></div>
                        </div>
                        <div className="title">MH Chatbot</div>
                    </div>
                    <ul className="messages" id="messageList">
                        {
                            this.renderMessages()
                        }
                    </ul>
                    <div className="bottom_wrapper clearfix">
                        <div className="message_input_wrapper">
                            <input className="message_input" placeholder="Mesajı giriniz..." value={this.state.message} onChange={this.messageChanged} />
                        </div>
                        <div className="send_message" onClick={this.sendMessage}>
                            <div>
                                <IoSend className="sendIcon"/>
                                <div className="text"> Gönder</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
        )
    }
}
export default Homepage;