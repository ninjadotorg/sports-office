package config

import (
	"log" 
	"golang.org/x/net/context" 
	firebase "firebase.google.com/go"
	//"firebase.google.com/go/auth" 
	"google.golang.org/api/option"
)
    
//=========firebase init =====
// dat, _ := ioutil.ReadFile("../firebase.json")

var firebaseApp *firebase.App


func InitFB() *firebase.App {  
	fbconfig := &firebase.Config{
		DatabaseURL: "https://smart-trash-188411.firebaseio.com",
	}

	firebaseOpt := option.WithCredentialsFile("firebase.json")

	fbctx :=context.Background()

	firebaseApp, err := firebase.NewApp(fbctx, fbconfig, firebaseOpt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	return firebaseApp
	// fbDatabase, err := firebaseApp.Database(fbctx)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// log.Fatalln("Error reading from database:", fbDatabase)


}
	// // As an admin, the app has access to read and write all data, regradless of Security Rules
	// ref := fbclient.NewRef("messages")
	// var data map[string]interface{}
	// if err := ref.Get(fbctx, &data); err != nil {
	// 		log.Fatalln("Error reading from database:", err)
	// } 



	//Example Write Database 
	/*
	if err := ref.Child("messages").Set(context.Background(), &Message{ 
		Sender: "1", 
		Content: "",
		Amount: 1,
		WinAmount: "0.1", //FormatFloat(3.1415, 'E', -1, 64)
		Symbol:    "ETH",
		Chance: 4700,
		Bet:	98733,
		Win: 1,
	} ); err != nil {
		fmt.Printf("Error setting value: %v ", err) 
	}
	*/