import React, {useEffect, useRef, useState} from 'react'
import p5 from 'p5'
import { BsCircleSquare } from 'react-icons/bs';

function Radar() {
    const p5ContainerRef = useRef();
    let btstatus = "";
    const sketch = (p) => {
        class Victim {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        }
        let victims = []
        let r = 20

        // Use these variables to adjust speed and starting degree

        // in rad
        let revealDeg = 3*p.PI/2
        let revealSpeed = 2*p.PI / 192
        let framesAfterButton = 0
        p.setup = () => {
            p.createCanvas(300, 300)
            p.frameRate(30)
        }
        p.draw = () => {
            // if(btstatus!=="50") return;
            
            p.background(255)
            // victims


            p.push()
            p.fill(255, 0, 0)
            p.noStroke()
            // p.stroke(255, 0, 0, 1)
            for (let victim of victims) {
                p.circle(victim.x, victim.y, r)
            }
            p.pop()

         

            // Revealer (large white circle that radially reveals the dots)
            if(revealDeg < 3*p.PI/2 + (2*p.PI) && btstatus==="50") {
                p.push()
                p.noStroke()
                p.rectMode(p.CENTER)
                p.translate(150, 200)
                p.fill(250)
                let ArcRad = 500
                p.arc(0, 0, ArcRad, ArcRad, revealDeg, 3*p.PI/2, p.PIE);
                p.pop()

            }
            
            // Robot
            p.push()
            p.fill(0)
            p.circle(150, 200, 20)
            p.pop()

            // Sweeper
            if(revealDeg < 3*p.PI/2 + (2*p.PI) && btstatus==="50") {
                p.push()
                let l = 500
                p.rectMode(p.CENTER)
                p.translate(150, 200)
                p.line(0, 0, l*Math.cos(revealDeg), l*Math.sin(revealDeg));
                p.stroke(0)
                p.pop()

                revealDeg += revealSpeed  
            }
            if(btstatus==="50") {
                framesAfterButton += 1
            }
            if(framesAfterButton<3){
                p.fill(250)
                p.circle(150,150,500)
            }
        }

        p.mousePressed = () => {
            if (p.mouseButton === p.RIGHT) {
                for (let i = 0; i < victims.length; i++) {
                    let victim = victims[i];
                    if(p.dist(victim.x, victim.y, p.mouseX, p.mouseY) < r) {
                        victims.splice(i, 1)
                        return false;
                    }
                }
            }
            else {
                victims.push(new Victim(p.mouseX, p.mouseY))
            }
        }
    }
    const fetchSerial = () => {
        console.log("fetching")
        fetch('http://192.168.59.10:8080/start_anim').then(res => {
            return res.json()
        }).then(data => {
            console.log(data.value)
            btstatus = data.value
        }).catch((err) => {
            // console.error(err)
        })
    }
    useEffect(() => {
        const p5Instance = new p5(sketch, p5ContainerRef.current);
        document.addEventListener('contextmenu', event => event.preventDefault());
        setInterval(fetchSerial, 250)
        return () => {
            p5Instance.remove()
        }
    }, [])
    return (
        <div className='w-[auto] h-[auto] p-[5px] border border-red-500 border-2' ref={p5ContainerRef} >
            
        </div>
    )
}

export default Radar