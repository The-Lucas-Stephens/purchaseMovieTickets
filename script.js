//Developer: Lucas Stephens
//Program: Vue Movies
//Purpose: Use vue and axios to load api into dom and display inforamtion from json
//Date 4/8/2022
//creating view component to stamp out and save writing html
//component for ticket button
Vue.component("ticketButton", {
    template: `<button @click=clickedBtn type="button" class="btn btn-dark btn-lg">{{placeholder}}</button>`,
    props: ["placeholder"],
    data() {
      return {
        btnClicked: 0,
      };
    },
    methods: {
      clickedBtn() {
        this.btnClicked++;
        console.log(this.btnClicked);
        this.$emit("addticket");
      },
    },
  });
  
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
    data() {
      return {
        ticketdata: this.ticketdataobj,
      };
    },
    methods: {
      clickKids() {
        if (this.ticketdata.kidsCount == undefined) {
          this.ticketdata.kidsCount = 1;
        } else {
          this.ticketdata.kidsCount++;
        }
        console.log(this.ticketdata.kidsCount);
        this.$emit("boughtchildticket", this.ticketdata);
      },
  
      clickAdult() {
        if (this.ticketdata.adultCount == undefined) {
          this.ticketdata.adultCount = 1;
        } else {
          this.ticketdata.adultCount++;
        }
        console.log(this.ticketdata.adultCount);
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
      movieData: [],
    },
    //creating methods
    methods: {
      boughtticket(e) {
        var checkThis = false;
        this.movieData.forEach((element) => {
          if (e.title == element.title) {
            checkThis = true;
            element.kidsAmount = e.kidsCount;
            element.adultAmount = e.adultCount;
          }
        });
  
        if (checkThis == false) {
          this.movieData.push({
            title: e.title,
            kidsAmount: e.kidsCount,
            adultAmount: e.adultCount,
          });
        }
  
        console.log(this.movieData);
      },
      removeKidsTicket(ticket) {
        if (ticket.kidsAmount > 0) {
          ticket.kidsAmount--;
        }
      },
  
      removeAdultTicket(ticket) {
        if (ticket.adultAmount > 0) {
          ticket.adultAmount--;
        }
      },
  
      removeAll(ticket) {
        for (let i = 0; i < this.movieData.length; i++) {
          if (ticket.title == this.movieData[i].title) {
            this.movieData.splice(i, 1);
          }
        }
        this.someMovies.forEach((element) => {
          if (element.title == ticket.title) {
            element.kidsCount = 0;
            element.adultCount = 0;
          }
        });
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