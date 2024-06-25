import { container, sprite } from '@tulib/tulip'

export const mainComponent = async () => {
	const $container = await container()
	
	const $logo = await sprite({
		texture: 'logo_full.png'
	});
	await $logo.setPosition({ x: 8, y: 8 })
	$container.add($logo);
	
	return $container.getComponent(mainComponent)
}