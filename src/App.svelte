<script>
	import { onMount } from 'svelte';
	let canvas_ball, canvas_tube, canvas_foot, canvas_help; 
	let ctx_ball, ctx_tube, ctx_foot, ctx_help;
	let radian, angle = 0, repeat = 0;
	let spin_axis = {	x : 16,	y : 240 + 30/2	};
	let ball = { x : 0,	y : 0,
		velocity : { x: 0, y: 0, },
		start: { x: 0, y: 0, }
	}

	var footer = new Image();
	footer.onload = function() { 
		//...рисуем лафет
		ctx_foot.drawImage(footer, 3, 251, 40, 30);
		//...рисуем поверхность
		ctx_foot.beginPath();
		ctx_foot.moveTo(3, 280);
		ctx_foot.lineTo(397, 280);
		ctx_foot.stroke();
	};
	footer.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAACVCAYAAAAtxKSWAAAACXBIWXMAAC4jAAAuIwF4pT92AAANWUlEQVR4nO3deZAU1R0H8N/rOXZn9uKGXdmDvaa7d8CVVWQXxAMQkF0FOYojwKKw3JgKSnFlWRQPUgIeHDHskkISI6YSUyF/iEQrKQ+UHCaF7BENWKXGiOWZoCGwM3lvxKPi4rxZXk/P9Hw/VbM9u7zu/lG13+3Xr7vfuMPhMEHyKiws7JWZ6buGiFUzonK+LOM/7s1fmfzlJQp/SmH27zCjD1iY3iAWPkkh+ktYO/t8W9uJ10KhEH4BFHDbXQDEzjCMPppG01mYzc7KzBjOf6RduDXLJkbZPGR5fBnk30daM54x09DfragwngyF6OcdHR2/56HqjNt/wmEQpCRSXl6e7/G4bndpbCH/1icycZH6M2KLXRot5qE6wUP1cDjMWlpbW/918dWmFgQpCfDumy8rI2ON1+Nezb9Nt2g3xTxU2xmjdUHTbGxtb9+DI5Q8BCnBmaZ5Oe++Pc7flsRpl335kW43P0I16Lo+u729vS1O+01qCFICq6jQl2lM20aRQYO4u8zt0v7Ij07LX21t/bEN+08qCFIC0jSNGUbgPkbaaptL8fOj015+7lTc1tbRiBG+C0OQEpBh6DsY0VK76/gCP3faYOp6D/52hd21JCoEKcHwrlQTP+FPmBB9idFyXtv7vJvXZHcpiQhBSiBBw5hEGmvs7vq5eXkUDAbFKB9lZWWT1+uhzz77jD75+BN6+x9v0xsnT9Lrr79O3b4Iz6iRn7f99fjx9ie7W6NTIUgJwjTNIn5qJE7qY7o61Lt3b5o2fTpNnFhLRUVFUdufPn2ajhw5Qoeeeoqeeea3dPbs2Vh2xw+W2l5e6yutra1vxLKi0yFICYL/hu7kix6y7f1+PzU0LKLvzJlDaWlp0vvJyMigMWPGRF6nTp2i5uY99MSBA9TZKX3JqAevdQdf1krvNAUgSAmAd5du5n/pb5Btbxgmbd26lfILCi5qv/369aN169bTlJun0OrVd9CJEyek1uOHzIkVFYHa48c7fnNRBTgIgmQzjTN1vUm2Q3fVVaNo67Zt5PP5lNUQ0HV67GeP03dvu41eeumI1Dos7GriCwTpPATJZmYgUMdDNFim7bArr6QHH3qIPB6P8jpEl2/nrl20ZMliOvryy9FXYFTFj0pj+VHpsPJikhCCZLOwxhbKHIxyc3Np27btloToC16vl7bzfUydOoXeeecdiTVct/IvCBIhSLYqLi4e4Pelj5dp29S0iXJycqwuibL5PjZubKLFixdFbcv/ANSZppmFu8URJFv5fN5xfOGK1m7UqKupZsQI6e2KIe4/HD1Kp947FQlfVdXl1KdPH+n1R4wcScOHV8ucL/n56xr+Oii9cYdCkGzEiI2VabdgwQKp7Z07d4527dxJjz66j86cOfPVfhij2to6WrN2LWVnZ0ttq76+XmrgQSO6mhAkBMlmVdEaFBQU0GVDh0bdkLgOtGLFcnr+uee+8W/iToaDB39Nr756jPb/5KdSXcTh1dXUs2dP+vDDD6M1jfp/SAUIkk00TfOYhh71GSPRzZKxd29LlyH6upMnT9KmTU2RQYtoXC4XXTFsGD196NC3N2ThMqkCHQ5BsolhDMrji6hDcPxkPuq2xNFo3759Uvs9/PTT9Oabb1J+fn7UtoFAIHqQiOXxPwruUCh0TqoAh0KQbBIOp2UziXFvMewdTUdHB3380UfS+z569KhUkAb0HyCzOca7n1l8GbUP6GQIkk0Y68yQGLCL3FMXzQcfvB/TvmXby949kZ6eLopEkCD+wmGXJnNEYhL3DsV6fUm2PZMpkOPdum+ZDiw1IEgOoOsG+TMy6NPTp6XaV1VhoE01BMkBxG1DM2fMoJaWlqhta2pqqKSkNA5VpRYEySGWLF0WGUQ4duzYBdv06duXNm26M45VpQ4EySHEw30tLXtp8+a76ODBg994nHzYsGF099330ACJUUCIHYLkID6/n+6+515avGQpvfDCC/Teqc/vtbv8iiukrkdB9yFIDiSuEc3g50wQPwgSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIEoACCBKAAggSgAIIUhd0Xb/UrWnD+dssq/ahERVate1483hcDUHT/Nju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";
	
	var tube = new Image();
	tube.onload = function() {
		//...рисуем ствол пушки 
		ctx_tube.drawImage(tube, 10, 240, 40, 30);
		ctx_tube.translate(10 + spin_axis.x, spin_axis.y);
	};
	tube.src = "data:image/png;base64,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";

	const tubeTurnOver = (grad) => {
		angle += grad; 
		if (angle < 10 && angle > -80) {
			//...поднимаем - опускаем ствол пушки
			ctx_tube.rotate(grad * Math.PI/180);
			ctx_tube.drawImage(tube, -spin_axis.x, -30/2, 40, 30); 
		} else {
			angle -= grad;
		}
	}
	
	const ballFire = async () => {
		resetBall();
		do {
			ball.velocity.x += Math.abs(2 * Math.cos(radian));
			ball.velocity.y += (2 * Math.sin(radian)) + 0.013 * repeat;
			await sleep(20);
			repeat++;
			console.log(repeat, ball.velocity.x, ball.velocity.y)
		} while (ball.y < 268);
	}

	const resetBall = () => {
		ball.velocity.x = 0;
		ball.velocity.y = 0;
		repeat = 0;
	}

	const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

	$: { //...вычисляем радианы при изменении угла
			radian = angle * Math.PI/180;
			resetBall();
			if (ctx_foot !== undefined) {
				//...рисуем градусы
				ctx_foot.clearRect(0, 0, 90, 60);
				ctx_foot.fillStyle = "rgba(55, 55, 55, 0.5)";
				ctx_foot.font = "30px Arial";
				ctx_foot.fillText(`${angle} \u00B0`, 10, 40);
			}
		}

	$: { //...вычисляем начальную позицию ядра при изменении радиан
			ball.start.x = 10 + spin_axis.x + Math.abs(20 * Math.cos(radian));
			ball.start.y = spin_axis.y + (20 * Math.sin(radian));
			if (ctx_help !== undefined) {
				//...рисуем сектор круга
				let my_gradient=ctx_help.createLinearGradient(10 + spin_axis.x, spin_axis.y, 326, spin_axis.y);
				my_gradient.addColorStop(0, "rgba(0, 255, 255, 0.1)");
				my_gradient.addColorStop(1, "transparent");
				ctx_help.fillStyle = my_gradient;
				
				ctx_help.beginPath();
				ctx_help.moveTo(10 + spin_axis.x, spin_axis.y);
				ctx_help.lineTo(156, spin_axis.y);
				angle < 0
					? ctx_help.arc(10 + spin_axis.x, spin_axis.y, 330, 0, radian, true)
					: ctx_help.arc(10 + spin_axis.x, spin_axis.y, 330, 0, radian, false);
				ctx_help.lineTo(10 + spin_axis.x, spin_axis.y);
				ctx_help.fill();
			}
		}

	$: { //...вычисляем положение ядра при изменении скорости по X и по Y
			ball.x = ball.start.x + ball.velocity.x;
			ball.y = ball.start.y + ball.velocity.y;
			if (ctx_ball !== undefined) {
				//...рисуем снаряд
				ctx_ball.beginPath();
				ctx_ball.lineWidth = 3;
				ctx_ball.arc(ball.x, ball.y, 9, 0, Math.PI*2, true);
				ctx_ball.stroke();
			}
		}

	$: 

	onMount(() => {
		ctx_foot = canvas_foot.getContext('2d');
		ctx_ball = canvas_ball.getContext('2d');
		ctx_ball.globalCompositeOperation = "copy"; 
		ctx_help = canvas_help.getContext('2d');
		ctx_help.globalCompositeOperation = "copy"; 
		ctx_tube = canvas_tube.getContext('2d');
		ctx_tube.globalCompositeOperation = "copy"; 
		// ctx.globalCompositeOperation = 'destination-over';
	});
</script>

<div class="container">
	<canvas id="Canvas_help" width="400" height="300" bind:this={canvas_help}></canvas>
	<canvas id="Canvas_ball" width="400" height="300" bind:this={canvas_ball}></canvas>
	<canvas id="Canvas_tube" width="400" height="300" bind:this={canvas_tube}></canvas>
	<canvas id="Canvas_foot" width="400" height="300" bind:this={canvas_foot}></canvas>
	
	<div class="control">
		<div class="control_wrap" on:click={resetBall}>
      <div class="arrow left"></div>
    </div>
		<div class="control_group">
			<div  class="control_wrap" on:click={() => tubeTurnOver(-5)}>
        <div class="arrow up"></div>
      </div>
			<div  class="control_wrap" on:click={() => tubeTurnOver(5)}>
        <div class="arrow down"></div>
      </div>
		</div>
		<div class="control_wrap" on:click={ballFire}>
      <div class="arrow right"></div>
    </div>
	</div>
</div>

<style>
	.container {
		position: relative;
		height: 360px;
		width: 400px;
		background: ghostwhite;
	}
	canvas {
		position: absolute;
	}
	.control {
		position: absolute;
		bottom: 0;
		width: 400px;
		background: bisque;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: .5rem;
	}
	.control_wrap {
		padding: .2rem;
	}
	.control_wrap:hover {
		cursor: pointer;
	}
  .arrow {
		width: 0; 
		height: 0; 
  }
	.up {
		border-left: .8rem solid transparent;
		border-right: .8rem solid transparent;
		border-bottom: .8rem solid black;
	}
  .up:hover {
    border-bottom: .8rem solid red;
  }
	.down {
		border-left: .8rem solid transparent;
		border-right: .8rem solid transparent;
		border-top: .8rem solid black;
	}
  .down:hover {
    border-top: .8rem solid red;
  }
	.right {
		border-top: 1rem solid transparent;
		border-bottom: 1rem solid transparent;
		border-left: 1rem solid black;
	}
  .right:hover {
    border-left: 1rem solid red;
  }
	.left {
		border-top: 1rem solid transparent;
		border-bottom: 1rem solid transparent;
		border-right: 1rem solid black;
	}
  .left:hover {
    border-right: 1rem solid red;
  }
</style>