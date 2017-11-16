const React = require('react');
const { Text, TouchableHighlight, View, StyleSheet, ScrollView } = require('react-native');

class ItemList extends React.Component {

	constructor() {
		super();

		this.scrollTop_ = 0;
		this.rootRef_ = null;
	}

	updateStateItemIndexes(props = null, height = null) {
		if (props === null) props = this.props;

		if (height === null) {
			if (!this.state) return;
			height = this.state.height;
		}

		const topItemIndex = Math.max(0, Math.floor(this.scrollTop_ / props.itemHeight));
		const visibleItemCount = Math.ceil(height/ props.itemHeight);

		let bottomItemIndex = topItemIndex + visibleItemCount - 1;
		if (bottomItemIndex >= props.items.length) bottomItemIndex = props.items.length - 1;

		this.setState({
			topItemIndex: topItemIndex,
			bottomItemIndex: bottomItemIndex,
		});
	}

	componentWillMount() {
		this.setState({
			topItemIndex: 0,
			bottomItemIndex: 0,
			height: 0,
		});

		this.updateStateItemIndexes();
	}

	componentWillReceiveProps(newProps) {
		this.updateStateItemIndexes(newProps);
	}

	onScroll(event) {
		this.scrollTop_ = Math.floor(event.nativeEvent.contentOffset.y);
		this.updateStateItemIndexes();
	}

	onLayout(event) {
		this.setState({ height: event.nativeEvent.layout.height });
		this.updateStateItemIndexes(null, event.nativeEvent.layout.height);
	}

	render() {
		const items = this.props.items;
		const style = {};

		if (!this.props.itemHeight) throw new Error('itemHeight is required');

		const blankItem = function(key, height) {
			return <View key={key} style={{height:height}}></View>
		}

		let itemComps = [blankItem('top', this.state.topItemIndex * this.props.itemHeight)];

		for (let i = this.state.topItemIndex; i <= this.state.bottomItemIndex; i++) {
			const itemComp = this.props.itemRenderer(items[i]);
			itemComps.push(itemComp);
		}

		itemComps.push(blankItem('bottom', (items.length - this.state.bottomItemIndex - 1) * this.props.itemHeight));

		return (
			<ScrollView scrollEventThrottle={500} onLayout={(event) => { this.onLayout(event); }} style={style} onScroll={ (event) => { this.onScroll(event) }}>
				{ itemComps }
			</ScrollView>
		);
	}
}

module.exports = { ItemList };