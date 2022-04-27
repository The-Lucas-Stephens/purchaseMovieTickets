//Developer: Lucas Stephens
//Program: Vue Movies
//Purpose: Use vue and axios to load api into dom and display inforamtion from json
//Date 4/8/2022
//creating view component to stamp out and save writing html
//component for ticket button
Vue.component("ticketButton", {
    template: `<button @click=clickedBtn type="button" class="btn btn-dark btn-lg">{{placeholder}}</button>`,
    props: ["placeholder"],
    //data used for the button component 
    data() {
      return {
        btnClicked: 0,
      };
    },
    //clicked button method that emmits an event that can be used
    methods: {
      clickedBtn() {
        this.btnClicked++;
        console.log(this.btnClicked);
        this.$emit("addticket");
      },
    },
  });
  //creating component that can be used to display movie and its info 
  Vue.component("moviediv", {
    template: `<div>
         <img v-bind:src="'https://image.tmdb.org/t/p/original'+imgsrc" alt="" class="movieImg">
         <div class="displayMovies">
          <h2 class="movieTitle"> Title: {{title}}</h2>
          <h2 class="movieOverView">Overview:{{overview}}</h2>
  
         </div>
         <ticketButton @addticket=clickKids  v-bind:placeholder="content"></ticketButton>
         <ticketButton  @addticket=clickAdult v-bind:placeholder="content2"></ticketButton>
      </div>`,
    props: [
      "overview",
      "title",
      "imgsrc",
      "someMoviesObj",
      "content",
      "content2",
      "ticketdataobj",
    ],
    //movie div component using movie obj from api call and tying it to a variable called ticketdataobj
    //then binidng it to the other data variable ticketdata so the div can use the movie obj from the api in methods
    data() {
      return {
        ticketdata: this.ticketdataobj,
      };
    },
    //creating methods for the movie div component 
    methods: {
      //adding a kids tickets 
      clickKids() {
        //checking if the property of the object in the array exists if not then it creates the variable and sets it equal to one
        if (this.ticketdata.kidsCount == undefined) {
          this.ticketdata.kidsCount = 1;
          //if property exists adds one to the running count of kids tickets for the object 
        } else {
          this.ticketdata.kidsCount++;
        }
        console.log(this.ticketdata.kidsCount);
        //creates event emitter and passes the movie obj as an argument
        this.$emit("boughtchildticket", this.ticketdata);
      },
      //adding a adult dicket 
      clickAdult() {
        //checking if property of the object in the array exists if not then it creates the varaible and set it equal to one
        if (this.ticketdata.adultCount == undefined) {
          this.ticketdata.adultCount = 1;
          //if property exists adds one to the running count of adult tickets for the object 
        } else {
          this.ticketdata.adultCount++;
        }
        console.log(this.ticketdata.adultCount);
         //creates event emitter and passes the movie obj as an argument
        this.$emit("boughtadultticket", this.ticketdata);
      },
    },
  });
  //creating a new vue instance to use for movies api call
  const movies = new Vue({
    //giving div name
    el: "#movies",
    //giving data to the dom using vue data members
    data: {
      pageHeader: "New and Upcoming Movies",
      pageHeader2: "Hover Over Image to Display More Info",
      displayInfo: "",
      displayInfo2: "",
      displayInfo3: "",
      someMovies: "",
      movieImg: "",
      kidsTicket: "Kids Ticket",
      adultTicket: "Adult Ticket",
      kidsPrice:7,
      adultPrice:9,
      totalTickets:0,
      taxPrice:0.08,
      taxAmount:0,
      overAllTotal:0,
      showToal:0,
      movieData: [],
    },
    //creating methods
    methods: {
      //method that adds the movie data object to the array
      //takes in an agrument labled in the method as e
      boughtticket(e) {
        //checker variable
        var checkThis = false;
        //looping through the movie data array to see if movie exists in the data array based on the title
        this.movieData.forEach((element) => {
          //if the movie exists it just sets the ticket count of the object equal to the created variabe called ticketype.amount
          if (e.title == element.title) {
            checkThis = true;
            element.kidsAmount = e.kidsCount;
            element.adultAmount = e.adultCount;
            console.log("Total Tickets: " +this.totalTickets)
          }
        });
        //if the movie doe not exist in the array then the movie obj is added to the array
        //a object is created and the properties of the movie are used to store in the array specfically the title,kids ticket amount,and adult ticket amount
        if (checkThis == false) {
          this.movieData.push({
            title: e.title,
            kidsAmount: e.kidsCount,
            adultAmount: e.adultCount,
          });
        }
  
        console.log(this.movieData);
      },
      //method that removes a kids ticket 
      removeKidsTicket(ticket) {
        if (ticket.kidsAmount > 0) {
          ticket.kidsAmount--;
        }
      },
      //method that removes a adult ticket 
      removeAdultTicket(ticket) {
        if (ticket.adultAmount > 0) {
          ticket.adultAmount--;
        }
      },
      //method that removes all current tickets for the current movie
      removeAll(ticket) {
        //looping through the array and finds the movie based on the title 
        //once movie is found removes it from the array 
        for (let i = 0; i < this.movieData.length; i++) {
          if (ticket.title == this.movieData[i].title) {
            this.movieData.splice(i, 1);
          }
        }
        //once movie is found also also sets all current ticket counts to 0
        this.someMovies.forEach((element) => {
          if (element.title == ticket.title) {
            element.kidsCount = 0;
            element.adultCount = 0;
          }
        });
      },
      //method revealing overall total 
      revealCart(){
        //variable to temporarly hold amount of tickets 
        var tempTickets = 0
        //looping through movie data array and adding to the running count of tickets
        this.movieData.forEach(element => {
          tempTickets += element.kidsAmount
          console.log(element.kidsAmount);
          tempTickets += element.adultAmount
          
        });
        console.log(tempTickets)
        //math for the totals
        this.totalTickets = tempTickets
        this.taxAmount =this.taxPrice * this.totalTickets
        this.overAllTotal = this.totalTickets + this.taxAmount
        //* use of to fixex method on next couple of lines is to limit result to 2 decimal places 
        this.showTotal=this.overAllTotal.toFixed(2)
        //printing out results in a h1 tag 
        document.getElementById('totalCart').innerHTML = "Total Tickets: " +this.totalTickets+" Taxes: " +" $ " + this.taxAmount.toFixed(2) + " Overall Total: " +" $ " +this.showTotal
      },
    },
    //window on load method to load all movies from api into dom when page loads
    mounted() {
      axios
        .get(
          "https://api.themoviedb.org/3/movie/upcoming?api_key=5134b3f56c2cae575bb0ad435f0be5ee&language=en-US&page=1"
        )
        .then((response) => {
          console.log(response);
          this.someMovies = response.data.results.splice(0, 3);
          console.log(this.someMovies);
  
          return this.someMovies;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });