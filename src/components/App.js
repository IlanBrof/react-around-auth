import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDelPopup from './ConfirmDelPopup';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isCardImagePopupOpen, setIsCardImagePopupOpen] = React.useState(false);
  const [isConfirmDelPopupOpen, setIsConfirmDelPopupOpen] =
    React.useState(false);
  const [cardData, setCardData] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [cardDelConfirm, setCardDelConfirm] = React.useState({});

  const [currentUser, setCurrentUser] = React.useState({});
  React.useEffect(() => {
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    (async function () {
      setLoading(true);
      try {
        const cardsData = await api.getInitialCards();
        if (cardsData) {
          setCards(cardsData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleUserInfo(newCard) {
    api
      .editUserInfo(newCard.name, newCard.about)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Send a request to the API and getting the updated card data
    if (!isLiked) {
      api
        .like(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .dislike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleAddCard(cardData) {
    api
      .uploadUserCard(cardData.name, cardData.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(e) {
    e.preventDefault();
    api
      .deleteCard(cardDelConfirm._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== cardDelConfirm._id));
      }, closeAllPopups())
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(userData) {
    api
      .setUserAvatar(userData.avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditProfilePopupClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddCardPopupClick() {
    setIsAddCardPopupOpen(true);
  }

  function handleEditAvatarPopupClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardImagePopupClick() {
    setIsCardImagePopupOpen(true);
  }

  function handleConfirmDelPopupClick(card) {
    setIsConfirmDelPopupOpen(true);
    setCardDelConfirm(card);
  }

  function handleCardData(cardData) {
    setCardData(cardData);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddCardPopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsCardImagePopupOpen(false);
    setIsConfirmDelPopupOpen(false);
  }

  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);

    return () => document.removeEventListener('keydown', closeByEscape);
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page-container">
        <Header />
        <Main
          onEditProfileClick={handleEditProfilePopupClick}
          onAddCardClick={handleAddCardPopupClick}
          onEditAvatarClick={handleEditAvatarPopupClick}
          onCardImageClick={handleCardImagePopupClick}
          updateCardData={handleCardData}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleConfirmDelPopupClick}
          loading={loading}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUserInfo={handleUserInfo}
        />

        <AddPlacePopup
          isOpen={isAddCardPopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCard}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          isOpen={isCardImagePopupOpen}
          onClose={closeAllPopups}
          cardData={cardData}
        />

        <ConfirmDelPopup
          isOpen={isConfirmDelPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
        />

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
