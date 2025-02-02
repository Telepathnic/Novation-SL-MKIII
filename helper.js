/**
 * Configure the layout selection of the small displays 
 * below the rotary controls. 
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param layoutIndex   Layout type index. 
 *  
 * @return  Array of bytes for layout command. 
 */
function make_Sysex_displayActivateLayoutByIndex(layoutIndex) {
    return [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x01,
        0x01, layoutIndex, 0xf7 ]
}

/**
 * Configure the small screen layout for knob layout.
 * 
 * @author Dave Burris (04/19/2022) 
 *  
 * @return  Array of bytes for layout command. 
 */
function make_Sysex_displayActivateLayoutKnob() {
    return make_Sysex_displayActivateLayoutByIndex(0x01)
}

/**
 * Display a text field in a display window.
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param columnIndex       Index of display.
 * @param textFieldIndex    Index of text field.
 * @param textString        String to display.
 *  
 * @return  Array of bytes for layout command. 
 */
function make_Sysex_displaySetTextOfColumn(columnIndex, textFieldIndex, textString) {
    var data = [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x01,
        0x02, columnIndex, 0x01, textFieldIndex]

    for(var i = 0; i < textString.length; ++i)
        data.push(textString.charCodeAt(i))

    data.push(0)
    data.push(0xf7)

    return data
}

/**
 * Display a knob value.
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param   columnIndex Index of display.
 * @param   objectIndex Knob object index.
 * @param   value Value to display.
 *  
 * @return  Array of bytes for layout command. 
 */
function make_Sysex_setDisplayValueOfColumn(columnIndex, objectIndex, value) {
    return [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x01,
        0x02, columnIndex, 0x03, objectIndex, value, 0xf7]
}

/**
 * Change display object color.
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param columnIndex   Index of display.
 * @param objectIndex   Index of the object to change color.
 * @param r             RGB red value.
 * @param g             RGB green value.
 * @param b             RGB blue value. 
 *  
 * @return  Array of bytes for layout command. 
 */
function make_Sysex_setDisplayColorOfColumn(columnIndex, objectIndex, r, g, b) {
    return [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x01,
        0x02, columnIndex, 0x04, objectIndex, r, g, b, 0xf7]
}

/**
 * Change the color of an LED (RGB).
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param ledIndex  LED Index.
 * @param r         RGB red value.
 * @param g         RGB green value.
 * @param b         RGB blue value. 
 *  
 * @return  Array of bytes for layout command. 
 */
function make_Sysex_setLEDColorRGB(ledIndex, r, g, b) {
    return [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x01,
        0x03, ledIndex, 0x01, r, g, b,
    0xf7]
}

/**
 * Change the color of an LED (Color index).
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param ledIndex  LED Index.
 * @param r         RGB red value.
 * @param g         RGB green value.
 * @param b         RGB blue value. 
 *  
 * @return  Array of bytes for layout command. 
 */
function make_Sysex_setLEDColor(ledIndex, colorId) {
    return [ 0xbf, ledIndex, colorId ]
}

/**
 * Display text in the center screen notification area.
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param line1     Text of line 1.
 * @param line2     Text of line 2.
 */
function make_Sysex_setNotificationText( line1, line2 ) {
    var data = [0xf0, 0x00, 0x20, 0x29, 0x02, 0x0a, 0x01, 0x04 ]

    for ( var i = 0; i < line1.length; ++i )
    {
        data.push(line1.charCodeAt(i) )
    }
    data.push( 0 )
    for ( var i = 0; i < line2.length; ++i )
    {
        data.push(line2.charCodeAt(i) )
    }
    data.push( 0 )
    data.push( 0xf7 )
    return data
}

/**
 * Reset the displays to their initial state.
 * 
 * @author Dave Burris (04/19/2022)
 * 
 * @param activeDevice      Device ID. 
 * @param outPort           MIDI output port.
 */
function resetDisplay(activeDevice, outPort) {
    outPort.sendMidi(activeDevice, make_Sysex_displayActivateLayoutKnob())
    for(var i = 0; i < 8; ++i) {
        for(var k = 0; k < 3; ++k) {
            outPort.sendMidi(activeDevice, make_Sysex_displaySetTextOfColumn(i, k, ""))
            outPort.sendMidi(activeDevice, make_Sysex_setDisplayColorOfColumn(i, k, 127, 127, 127))
        }
    }
}

module.exports = {
    sysex: {
        displayActivateLayoutByIndex: make_Sysex_displayActivateLayoutByIndex,
        displayActivateLayoutKnob: make_Sysex_displayActivateLayoutKnob,
        displaySetTextOfColumn: make_Sysex_displaySetTextOfColumn,
        setDisplayValueOfColumn: make_Sysex_setDisplayValueOfColumn,
        setDisplayColorOfColumn: make_Sysex_setDisplayColorOfColumn,
        setLEDColorRGB: make_Sysex_setLEDColorRGB,
        setLEDColor: make_Sysex_setLEDColor,
        setNotificationText: make_Sysex_setNotificationText
    },
    display: {
        reset: resetDisplay
    }
}
