import React, { useState, useEffect } from 'react';
import { View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { DEFAULT, millisToMinutesAndSeconds } from '../common';

const Countdown = ({
	duration = DEFAULT.Options.lockDuration || 60000,
	style, textStyle,
	onFinish
}: {
	duration?: number;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	onFinish: () => void;
}) => {
	const [remaining, setRemaining] = useState(duration);

	useEffect(() => {
		const id = setTimeout(() => {
			if (remaining > 1000) {
				setRemaining(remaining - 1000);
			} else {
				onFinish();
			}
		}, 1000)
		return () => clearTimeout(id);
	}, [remaining])

	return <View style={[DEFAULT.Styles.locked?.countdown, style]}>
		<Text style={[DEFAULT.Styles.locked?.countdownText, textStyle]}>{millisToMinutesAndSeconds(remaining)}</Text>
	</View>
}

export default Countdown;