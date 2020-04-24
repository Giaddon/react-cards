import React, { useState, useEffect } from "react";
import { CARDSAPI } from "./config";
import axios from "axios";
import "./CardTable.css";

/** Renders the suit and value of cards drawn from 
 * the Deck of Cards API. Displays an error message if user tries
 * to draw from an emty deck.
 */ 

function CardTable() {
  const [deckID, setDeckID] = useState("new");
  const [deckIsEmpty, setDeckIsEmpty] = useState(false);
  const [drawnCards, setDrawnCards] = useState([]);
  
  /** Makes a new deck on initial render and stores the deck id for future use.
   */
  
  useEffect( () => {
    async function makeNewDeck() {
      const resp = await axios.get(`${CARDSAPI}/new/shuffle/?deck_count=1`)
      setDeckID(resp.data.deck_id);
    }
    makeNewDeck();
    }, []
  )

  /** Draws a card from the current deck and updates our drawn cards. 
   * Displays alert if no cards remaining in deck. 
   */

  async function drawCard(){
    if (deckIsEmpty) {
      alert("NO CARDS REMAINING");
    } else {  
      const resp = await axios.get(`${CARDSAPI}/${deckID}/draw/?count=1`);
      const newCard = resp.data.cards[0];
      setDrawnCards(cards => [newCard, ...cards]) 
      if (resp.data.remaining === 0) setDeckIsEmpty(true);
    }
  }

  async function shuffleDeck(){
    const resp = await axios.get(`${CARDSAPI}/${deckID}/shuffle`);
    setDeckIsEmpty(false);
    setDrawnCards(cards => []);
    console.log(`\n\n\n The value of DrawnCards is `, drawnCards);
  }

  return (
    <div className="CardTable">
      <button onClick={drawCard}>Draw a card</button>
      <button onClick={shuffleDeck}>Shuffle Deck</button>
      {
        drawnCards.length > 0
          ? <ol> { drawnCards.map( c => <li>{c.value} of {c.suit}</li>) } </ol> 
          : <p>No cards drawn.</p>
      }
    </div>
  )
}

export default CardTable;