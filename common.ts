/**
 * This simple G Suite add-on shows a random image of a cat in the sidebar. When
 * opened manually (the homepage card), some static text is overlayed on
 * the image, but when contextual cards are opened a new cat image is shown
 * with the text taken from that context (such as a message's subject line)
 * overlaying the image. There is also a button that updates the card with a
 * new random cat image.
 */

/**
 * The maximum number of characters that can fit in the cat image.
 */
const MAX_MESSAGE_LENGTH = 40;

/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage(e) {
    console.log(e);
    const hour = Number(Utilities.formatDate(new Date(), e.userTimezone.id, 'H'));
    let message;
    if (hour >= 6 && hour < 12) {
        message = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        message = 'Good afternoon';
    } else {
        message = 'Good night';
    }
    message += ' ' + e.hostApp;
    return createCatCard(message, true);
}

/**
 * Creates a card with an image of a cat, overlayed with the text.
 * @param {String} text The text to overlay on the image.
 * @param {Boolean} isHomepage True if the card created here is a homepage;
 *      false otherwise. Defaults to false.
 * @return {CardService.Card} The assembled card.
 */
function createCatCard(text, isHomepage= false) {

    // Use the "Cat as a service" API to get the cat image. Add a "time" URL
    // parameter to act as a cache buster.
    const now = new Date();
    // Replace forward slashes in the text, as they break the CataaS API.
    const caption = text.replace(/\//g, ' ');
    const imageUrl =
        Utilities.formatString('https://cataas.com/cat/says/%s?time=%s',
            encodeURIComponent(caption), now.getTime());
    const image = CardService.newImage()
        .setImageUrl(imageUrl)
        .setAltText('Meow');

    // Create a button that changes the cat image when pressed.
    // Note: Action parameter keys and values must be strings.
    const action = CardService.newAction()
        .setFunctionName('onChangeCat')
        .setParameters({text: text, isHomepage: isHomepage.toString()});
    const button = CardService.newTextButton()
        .setText('Change cat')
        .setOnClickAction(action)
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
    const buttonSet = CardService.newButtonSet()
        .addButton(button);

    // Create a footer to be shown at the bottom.
    const footer = CardService.newFixedFooter()
        .setPrimaryButton(CardService.newTextButton()
            .setText('Powered by cataas.com')
            .setOpenLink(CardService.newOpenLink()
                .setUrl('https://cataas.com')));

    // Assemble the widgets and return the card.
    const section = CardService.newCardSection()
        .addWidget(image)
        .addWidget(buttonSet);
    const card = CardService.newCardBuilder()
        .addSection(section)
        // @ts-ignore outdated TS types, setFixedFooter does not exist in @types/google-apps-script
        .setFixedFooter(footer);

    if (!isHomepage) {
        // Create the header shown when the card is minimized,
        // but only when this card is a contextual card. Peek headers
        // are never used by non-contexual cards like homepages.
        const peekHeader = CardService.newCardHeader()
            .setTitle('Contextual Cat')
            .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png')
            .setSubtitle(text);
        card.setPeekCardHeader(peekHeader)
    }

    return card.build();
}

/**
 * Callback for the "Change cat" button.
 * @param {Object} e The event object, documented {@link https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onChangeCat(e) {
    console.log(e);
    // Get the text that was shown in the current cat image. This was passed as a
    // parameter on the Action set for the button.
    const text = e.parameters.text;

    // The isHomepage parameter is passed as a string, so convert to a Boolean.
    const isHomepage = e.parameters.isHomepage === 'true';

    // Create a new card with the same text.
    const card = createCatCard(text, isHomepage);

    // Create an action response that instructs the add-on to replace
    // the current card with the new one.
    const navigation = CardService.newNavigation()
        .updateCard(card);
    const actionResponse = CardService.newActionResponseBuilder()
        .setNavigation(navigation);
    return actionResponse.build();
}

/**
 * Truncate a message to fit in the cat image.
 * @param {string} message The message to truncate.
 * @return {string} The truncated message.
 */
function truncate(message) {
    if (message.length > MAX_MESSAGE_LENGTH) {
        message = message.slice(0, MAX_MESSAGE_LENGTH);
        message = message.slice(0, message.lastIndexOf(' ')) + '...';
    }
    return message;
}
