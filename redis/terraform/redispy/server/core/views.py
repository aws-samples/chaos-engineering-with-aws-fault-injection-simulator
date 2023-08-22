from datetime import timedelta

import asyncio
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.decorators import classonlymethod
from django.views import View
from ipware import get_client_ip
from redis.cluster import RedisCluster

redis_cluster = RedisCluster(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    password=settings.REDIS_PASSWORD,
    skip_full_coverage_check=True,  # Bypass Redis CONFIG call to elasticache
    decode_responses=True,          # decode_responses must be set to True when used with python3
    ssl=True,                       # in-transit encryption, https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/in-transit-encryption.html
    ssl_cert_reqs=None              # see https://github.com/andymccurdy/redis-py#ssl-connections
)
key = 'PING'
limit = 10
period = timedelta(seconds=10)


def request_is_limited(red: RedisCluster, redis_key: str, redis_limit: int, redis_period: timedelta):
    if red.setnx(redis_key, redis_limit):
        red.expire(redis_key, int(redis_period.total_seconds()))
    bucket_val = red.get(redis_key)
    if bucket_val and int(bucket_val) > 0:
        red.decrby(redis_key, 1)
        return False
    return True


class GetPongView(View):
    @classonlymethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        view._is_coroutine = asyncio.coroutines._is_coroutine
        return view

    async def get(self, request, *args, **kwargs):
        ip, is_routable = get_client_ip(request)
        if request_is_limited(redis_cluster,  '%s:%s' % (ip, key), limit, period):
            return HttpResponse("Too many requests, please try again later.", status=429)
        return HttpResponse("PONG", status=200)


def index(request):
    context = {}
    return render(request, 'index.html', context)
