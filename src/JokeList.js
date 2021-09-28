import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokesToGet: 10
  }

  constructor(props) {
    super(props);
    this.state = { jokes: [] };

    this.sortedJokes = [];
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.getJokes = this.getJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
  }
  vote(id, delta) {
    this.setState({
      jokes: this.state.jokes.map((j) => {
        return j.id === id ? { ...j, votes: j.votes + delta } : j;
      }),
    });
  }

  async getJokes() {
    try {
        let j = this.state.jokes;
        let seenJokes = new Set();
        while (j.length < this.props.numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });
          let { status, ...jokeObj } = res.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        this.setState({ jokes: j });
        this.sortedJokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
      } catch (e) {
        console.log(e);
      }
  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  render() {
    this.sortedJokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>

        {this.sortedJokes.map((j) => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={this.vote}
          />
        ))}
      </div>
    );
  }
}

export default JokeList;
