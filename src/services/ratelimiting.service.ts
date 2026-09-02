const userCooldowns = new Map<string, number>();
const requestTimestamps: number[] = [];

const USER_COOLDOWN_MS = 5000;
const MAX_GLOBAL_RPM = 28;
const ONE_MINUTE_MS = 60 * 1000;

export interface RateLimitResult {
	limited: boolean;
	reason?: "user" | "global";
	timeLeft?: number;
}

export const checkRateLimit = (userId: string): RateLimitResult => {
	const now = Date.now();
	const lastUserRequest = userCooldowns.get(userId);
	if (lastUserRequest && now - lastUserRequest < USER_COOLDOWN_MS) {
		const timeLeft = parseFloat(
			((USER_COOLDOWN_MS - (now - lastUserRequest)) / 1000).toFixed(1),
		);
		return { limited: true, reason: "user", timeLeft };
	}
	while (
		requestTimestamps.length > 0 &&
		(requestTimestamps[0] ?? 0) <= now - ONE_MINUTE_MS
	) {
		requestTimestamps.shift();
	}

	if (requestTimestamps.length >= MAX_GLOBAL_RPM) {
		return { limited: true, reason: "global" };
	}

	userCooldowns.set(userId, now);
	requestTimestamps.push(now);

	return { limited: false };
};
