/*
    Everything note UI related.
*/


var emptyNotePrompt = "➕ Add a note!";


/*
    THE PUBLIC FUNCTION OF THIS API
    Injects the actual widget. (incl. loader)
    Params:
        `injectInto`: a class, id etc. which the widget is appended to
        `twitterID` : the Twitter UID to inject the note for.
        `topMargin` : OPTIONAL - adds a top margin to the widget.
*/
function InjectWidget(injectInto, twitterID, topMargin)
{
    topMargin = topMargin || 0; //topMargin will either be set to topMargin or 0. (Optional param)

    if ($(injectInto).attr('data-whodis-exists') == 'true')
    {
        //Don't inject, return
        return;
    }

    var loader = '<div id="whodis-loading-spinner" style="margin-top:'+topMargin+';"><center><img src="https://abs.twimg.com/a/1482872295/img/t1/spinner-rosetta-blue-26x26.gif"></center></div>';
    $(injectInto).append(loader);
    $(injectInto).attr('data-whodis-exists', 'true');
    //Use the GetInjection callback
    GetInjection(twitterID, function(response)
    {
        var injectionCode = $(response);
        //Remove spinner
        $('#whodis-loading-spinner').remove();
        //Add the WhoDis HTML
        $(injectInto).append(injectionCode);
        injectionCode.css('margin-top', topMargin);
        MakeInlineEditable(twitterID, injectionCode);
    });
}



/*
    Returns the HTML to be injected
*/
function GetInjection(twitterID, callback)
{

    CheckUserAuth(function(isAuthenticated)
    {
        //If the user is not logged in
        if (!isAuthenticated)
        {
            callback(WhodisTemplate(PromptSignIn()));
            return;
        }
    });
    // Else if the user is logged in...

    //console.log('Getting injection FOR : ' + twitterID);
    GetNote(twitterID, function(response)
    {
        //console.log('NoteUI GetNote response : ');
        //console.log(response);
        var textValue;
        if (response === undefined || response == null)
        {
            textValue = emptyNotePrompt;
        }
        else
        {
            textValue = response.note;
        }
        //console.log ('Injecting note \ntextValue = ' + textValue);
        callback(WhodisTemplate(NoteTextTemplate(textValue)));
    });

}

/*
    Returns HTML code asking user to sign in.
*/
function PromptSignIn()
{
    return "⚠️ Please sign in first by clicking on the chrome extension's icon.";
}


/*
    Inner template which makes the note in-place-replaceable.
*/
function NoteTextTemplate(textToBeInserted)
{
    return '<form><input type="hidden" name="hiddenField" /></form><pre><p class="whodis-note">' + textToBeInserted + '</p></pre>';
}

/*
    The outer template which controls the appearance/theme of the whodis widget
*/
function WhodisTemplate(textToBeInserted)
{
    var borderColorForNoteWrapper = $('.tweet-btn').css("background-color");
    //console.log("background-color is " + borderColorForNoteWrapper);
    return '<div class="whodis-holder"><img src="'+ chrome.extension.getURL("/Images/whodis-tiny-logo.png") +'"><div class="note-wrapper" style="border-color:'+ borderColorForNoteWrapper +'">'+ textToBeInserted +'</div></div>';
}
