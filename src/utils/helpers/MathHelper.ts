import { Point } from '../DataTypes';

export class MathHelper {

    public static randomFrom(from: number, to: number): number {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    public static randomFromArray<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    public static popRandom<T>(array: T[]): T {
        return array.splice(Math.floor(Math.random() * array.length), 1)[0];
    }

    public static toFixedNumber(value: number, fixedTo: number = 2): number {
        return Number(value.toFixed(fixedTo));
    }

    public static getDistance(pos1: Point, pos2: Point): number {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static getVelocity(from: Point, to: Point, speed: number): Point {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return { x: dx / distance * speed, y: dy / distance * speed };
    }

    public static getAngleBetweenTwoPoints(origin: Point, pA: Point, pB: Point): number {
        return Phaser.Math.RadToDeg(Math.atan2(pB.y - origin.y, pB.x - origin.x) -
                                    Math.atan2(pA.y - origin.y, pA.x - origin.x));
    }

    public static getPositionFromDistanceAndAngle(origin: Point, distance: number, angle: number): Point {
        return {
            x: origin.x + distance * Math.cos(Phaser.Math.DegToRad(angle)),
            y: origin.y + distance * Math.sin(Phaser.Math.DegToRad(angle)),
        };
    }

    public static circleRectangleCollision(
        circleCenter: Point, radius: number, rectangleCenter: Point, rectangleDimensions: Point): boolean {
        // temporary variables to set edges for testing
        let testX = circleCenter.x;
        let testY = circleCenter.y;

        // which edge is closest?
        if (circleCenter.x < rectangleCenter.x - rectangleDimensions.x * 0.5) {
            testX = rectangleCenter.x - rectangleDimensions.x * 0.5;
        } else if (circleCenter.x > rectangleCenter.x + rectangleDimensions.x * 0.5) {
            testX = rectangleCenter.x + rectangleDimensions.x * 0.5;
        }
        if (circleCenter.y < rectangleCenter.y - rectangleDimensions.y * 0.5) {
            testY = rectangleCenter.y - rectangleDimensions.y * 0.5;
        } else if (circleCenter.y > rectangleCenter.y + rectangleDimensions.y * 0.5) {
            testY = rectangleCenter.y + rectangleDimensions.y * 0.5;
        }

        // get distance from closest edges
        const distX = circleCenter.x - testX;
        const distY = circleCenter.y - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));

        // if the distance is less than the radius, collision!
        if (distance <= radius) {
            return true;
        }
        return false;
    }

    /**
     * return 0 from an empty array
     */
    public static sum(array: number[]): number {
        if (array.length === 0) {
            return 0;
        }
        return array.reduce((prev: number, current: number) => {
            return prev + current;
        });
    }

    public static isBetween(value: number, from: number, to: number): boolean {
        if (value < from) {
            return false;
        }
        if (value > to) {
            return false;
        }
        return true;
    }

    public static getValueIfInRange(min: number, value: number, max: number): number {
        return value < min ? min : value > max ? max : value;
    }

    public static multiplyPoint(p: Point, m: number): Point {
        return {
            x: p.x * m,
            y: p.y * m,
        };
    }
}
