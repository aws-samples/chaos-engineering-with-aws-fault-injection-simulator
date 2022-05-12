package com.skipio.demo.chaos.fis.product;

import org.apache.commons.lang.math.RandomUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.StopWatch;
import org.springframework.util.StreamUtils;

import java.math.BigInteger;
import java.util.Timer;
import java.util.stream.IntStream;

@SpringBootTest
class ProductApplicationTests {

    @Test
    void contextLoads() {
    }

    public static void main(String[] args) {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();;



        long t1 = System.nanoTime(), foo = 1; for (long i = 1; System.nanoTime() - t1 < 50000000L; i++) { foo *= i; }

        stopWatch.stop();;
        System.out.println(stopWatch.getLastTaskTimeMillis());
    }
}
